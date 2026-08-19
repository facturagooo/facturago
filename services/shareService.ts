import { Client, Supplier, CompanySettings } from '../types';
import { generatePDFBlob } from './pdfService';

export interface ShareResult {
    success: boolean;
    method: 'native_share' | 'download_and_whatsapp' | 'cancelled' | 'error';
    fileName?: string;
    message?: string;
}

export const cleanPhoneNumberForWhatsApp = (rawPhone?: string): string => {
    if (!rawPhone) return '';
    let cleaned = rawPhone.replace(/\D/g, '');
    if (!cleaned) return '';

    // Remove leading international prefix '00'
    if (cleaned.startsWith('00')) {
        cleaned = cleaned.substring(2);
    }

    // Moroccan standard local format check (e.g. 06..., 07..., 05... -> 10 digits)
    if (cleaned.startsWith('0') && cleaned.length === 10) {
        cleaned = '212' + cleaned.substring(1);
    }

    return cleaned;
};

export const triggerBlobDownload = (blob: Blob, fileName: string) => {
    try {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            if (document.body.contains(a)) {
                document.body.removeChild(a);
            }
            URL.revokeObjectURL(url);
        }, 3000);
    } catch (e) {
        console.error('Error triggering file download:', e);
    }
};

export const shareDocument = async (
    type: string,
    doc: any,
    settings: CompanySettings | null,
    recipient: Client | Supplier | undefined,
    isRTL: boolean = false,
    language: string = 'fr',
    existingBlob?: Blob
): Promise<ShareResult> => {
    const documentId = doc.documentId || doc.id;
    const amount = doc.amount || doc.totalAmount || 0;
    const formattedAmount = amount.toLocaleString(language === 'ar' ? 'ar-MA' : 'fr-FR', { 
        style: 'currency', 
        currency: settings?.defaultCurrencyCode || 'MAD' 
    });
    
    const fileName = `${type.toLowerCase().replace(/\s+/g, '_')}_${documentId}.pdf`;

    let message = '';
    if (isRTL || language === 'ar') {
        message = `مرحباً، إليكم ${type} رقم ${documentId} بمبلغ ${formattedAmount}. شكراً لكم.`;
    } else if (language === 'es') {
        message = `Hola, aquí está su ${type} #${documentId} por un importe de ${formattedAmount}. Gracias.`;
    } else if (language === 'en') {
        message = `Hello, here is your ${type} #${documentId} for an amount of ${formattedAmount}. Thank you.`;
    } else {
        message = `Bonjour, voici votre ${type} #${documentId} d'un montant de ${formattedAmount}. Merci.`;
    }

    const cleanPhone = cleanPhoneNumberForWhatsApp(recipient?.phone);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = cleanPhone 
        ? `https://wa.me/${cleanPhone}?text=${encodedMessage}` 
        : `https://wa.me/?text=${encodedMessage}`;

    // 1. Try Native Web Share API (Direct file attachment on Mobile Chrome, Safari, Android, iOS)
    if (typeof navigator !== 'undefined' && navigator.share) {
        try {
            const blob = existingBlob || await generatePDFBlob(type as any, doc, settings, recipient);
            const file = new File([blob], fileName, { type: 'application/pdf' });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: `${type} #${documentId}`,
                    text: message,
                });
                return { success: true, method: 'native_share', fileName };
            }
        } catch (error: any) {
            // Silently catch AbortError (user cancelled share sheet)
            if (error.name === 'AbortError') {
                return { success: false, method: 'cancelled' };
            }
            console.warn('Native Web Share failed or not allowed, falling back to download + WhatsApp:', error);
        }
    }

    // 2. Fallback for Desktop / browsers where Web Share with files is unavailable:
    // Automatically download the PDF file to the device so the user has the file, then open WhatsApp
    try {
        const blob = existingBlob || await generatePDFBlob(type as any, doc, settings, recipient);
        
        // Save/download PDF file
        triggerBlobDownload(blob, fileName);

        // Open WhatsApp directly without popup blocker
        // On mobile, window.location.href seamlessly opens the WhatsApp app without triggering popup blocker
        const isMobileDevice = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        if (isMobileDevice) {
            window.location.href = whatsappUrl;
        } else {
            const newWindow = window.open(whatsappUrl, '_blank');
            if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
                window.location.href = whatsappUrl;
            }
        }

        return { success: true, method: 'download_and_whatsapp', fileName };
    } catch (err: any) {
        console.error('Error during fallback share:', err);
        window.location.href = whatsappUrl;
        return { success: false, method: 'error', message: err?.message };
    }
};
