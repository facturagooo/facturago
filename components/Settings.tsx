
import React, { useRef, useState } from 'react';
import Header from './Header';
import { dbService } from '../db';
import { Download, Upload, AlertTriangle, Database, Check, Copy, FileCode, CheckCircle2, Server } from 'lucide-react';

const SUPABASE_FULL_SQL_SCHEMA = `-- ==============================================================================
-- FACTURAGO SAAS - SCRIPT DE CRÉATION COMPLET DE LA BASE DE DONNÉES SUPABASE
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- TABLE 1: clients
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    company_id UUID,
    "clientCode" TEXT,
    type TEXT DEFAULT 'Entreprise',
    name TEXT,
    company TEXT,
    ice TEXT,
    rc TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 2: suppliers
CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    company_id UUID,
    "supplierCode" TEXT,
    type TEXT DEFAULT 'Entreprise',
    name TEXT,
    company TEXT,
    ice TEXT,
    rc TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 3: products
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    company_id UUID,
    "productCode" TEXT,
    barcode TEXT,
    name TEXT,
    description TEXT,
    "productType" TEXT DEFAULT 'Produit',
    "unitOfMeasure" TEXT DEFAULT 'Unité',
    "salePrice" NUMERIC DEFAULT 0,
    "purchasePrice" NUMERIC DEFAULT 0,
    vat NUMERIC DEFAULT 20,
    "stockQuantity" NUMERIC DEFAULT 0,
    "minStockAlert" NUMERIC DEFAULT 5,
    category TEXT,
    "hasVariants" BOOLEAN DEFAULT false,
    variants JSONB DEFAULT '[]'::jsonb,
    "imageUrl" TEXT,
    "createdAt" TEXT DEFAULT CURRENT_DATE::TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 4: quotes
CREATE TABLE IF NOT EXISTS quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    company_id UUID,
    "documentId" TEXT,
    "clientId" TEXT,
    "clientName" TEXT,
    date TEXT,
    "expiryDate" TEXT,
    amount NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'Brouillon',
    subject TEXT,
    "paymentMethod" TEXT,
    "checkNumber" TEXT,
    "bankName" TEXT,
    reference TEXT,
    "purchaseOrderNumber" TEXT,
    "showDimensions" BOOLEAN DEFAULT false,
    "lineItems" JSONB DEFAULT '[]'::jsonb,
    "subTotal" NUMERIC DEFAULT 0,
    "vatAmount" NUMERIC DEFAULT 0,
    "discountType" TEXT,
    "discountValue" NUMERIC DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 5: invoices
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    company_id UUID,
    "documentId" TEXT,
    "quoteId" TEXT,
    "clientId" TEXT,
    "clientName" TEXT,
    date TEXT,
    "dueDate" TEXT,
    "paymentDate" TEXT,
    amount NUMERIC DEFAULT 0,
    "amountPaid" NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'Brouillon',
    subject TEXT,
    "paymentMethod" TEXT,
    "checkNumber" TEXT,
    "bankName" TEXT,
    reference TEXT,
    "purchaseOrderNumber" TEXT,
    "showDimensions" BOOLEAN DEFAULT false,
    "lineItems" JSONB DEFAULT '[]'::jsonb,
    "subTotal" NUMERIC DEFAULT 0,
    "vatAmount" NUMERIC DEFAULT 0,
    "discountType" TEXT,
    "discountValue" NUMERIC DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 6: delivery_notes
CREATE TABLE IF NOT EXISTS delivery_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    company_id UUID,
    "documentId" TEXT,
    "invoiceId" TEXT,
    "clientId" TEXT,
    "clientName" TEXT,
    date TEXT,
    subject TEXT,
    "paymentMethod" TEXT,
    "checkNumber" TEXT,
    "bankName" TEXT,
    reference TEXT,
    "purchaseOrderNumber" TEXT,
    "showDimensions" BOOLEAN DEFAULT false,
    "lineItems" JSONB DEFAULT '[]'::jsonb,
    status TEXT DEFAULT 'Brouillon',
    "subTotal" NUMERIC DEFAULT 0,
    "vatAmount" NUMERIC DEFAULT 0,
    "totalAmount" NUMERIC DEFAULT 0,
    "paymentAmount" NUMERIC DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 7: purchase_orders
CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    company_id UUID,
    "documentId" TEXT,
    "supplierId" TEXT,
    "supplierName" TEXT,
    date TEXT,
    "expectedDate" TEXT,
    "dueDate" TEXT,
    status TEXT DEFAULT 'Brouillon',
    subject TEXT,
    "paymentMethod" TEXT,
    "checkNumber" TEXT,
    "bankName" TEXT,
    reference TEXT,
    "lineItems" JSONB DEFAULT '[]'::jsonb,
    "subTotal" NUMERIC DEFAULT 0,
    "vatAmount" NUMERIC DEFAULT 0,
    "totalAmount" NUMERIC DEFAULT 0,
    "amountPaid" NUMERIC DEFAULT 0,
    "discountType" TEXT,
    "discountValue" NUMERIC DEFAULT 0,
    "showDimensions" BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 8: credit_notes
CREATE TABLE IF NOT EXISTS credit_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    company_id UUID,
    "documentId" TEXT,
    "invoiceId" TEXT,
    "clientId" TEXT,
    "clientName" TEXT,
    date TEXT,
    amount NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'Brouillon',
    subject TEXT,
    "paymentMethod" TEXT,
    "checkNumber" TEXT,
    "bankName" TEXT,
    reference TEXT,
    "showDimensions" BOOLEAN DEFAULT false,
    "lineItems" JSONB DEFAULT '[]'::jsonb,
    "subTotal" NUMERIC DEFAULT 0,
    "vatAmount" NUMERIC DEFAULT 0,
    "discountType" TEXT,
    "discountValue" NUMERIC DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 9: payments
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    company_id UUID,
    "invoiceId" TEXT,
    "invoiceNumber" TEXT,
    "clientId" TEXT,
    "clientName" TEXT,
    date TEXT,
    amount NUMERIC DEFAULT 0,
    method TEXT DEFAULT 'Virement',
    reference TEXT,
    "bankName" TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 10: stock_movements
CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    company_id UUID,
    "productId" TEXT,
    "variantId" TEXT,
    "productName" TEXT,
    date TEXT,
    quantity NUMERIC DEFAULT 0,
    type TEXT DEFAULT 'Ajustement',
    reference TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 11: expenses
CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    company_id UUID,
    category TEXT,
    description TEXT,
    amount NUMERIC DEFAULT 0,
    date TEXT,
    reference TEXT,
    notes TEXT,
    "purchaseOrderId" TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 12: employees
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    company_id UUID,
    "firstName" TEXT,
    "lastName" TEXT,
    role TEXT,
    phone TEXT,
    email TEXT,
    "dailyRate" NUMERIC DEFAULT 0,
    "monthlySalary" NUMERIC DEFAULT 0,
    "paymentType" TEXT DEFAULT 'Monthly',
    "joinDate" TEXT,
    "isActive" BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 13: attendances
CREATE TABLE IF NOT EXISTS attendances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    company_id UUID,
    "employeeId" TEXT,
    date TEXT,
    status TEXT DEFAULT 'Present',
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 14: salary_payments
CREATE TABLE IF NOT EXISTS salary_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    company_id UUID,
    "employeeId" TEXT,
    amount NUMERIC DEFAULT 0,
    "paymentDate" TEXT,
    "periodStart" TEXT,
    "periodEnd" TEXT,
    status TEXT DEFAULT 'Paid',
    reference TEXT,
    type TEXT,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- TABLE 15: settings
CREATE TABLE IF NOT EXISTS settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    company_id UUID,
    "companyName" TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    rc TEXT,
    ice TEXT,
    "fiscalId" TEXT,
    patente TEXT,
    cnss TEXT,
    capital TEXT,
    logo TEXT,
    "logoWidth" NUMERIC DEFAULT 200,
    "showLogoWatermark" BOOLEAN DEFAULT true,
    "logoWatermarkOpacity" NUMERIC DEFAULT 0.07,
    stamp TEXT,
    "stampWidth" NUMERIC DEFAULT 220,
    "primaryColor" TEXT DEFAULT '#10b981',
    "headerTextColor" TEXT DEFAULT '#ffffff',
    "tableHeaderBgColor" TEXT DEFAULT '#10b981',
    "showTableBorders" BOOLEAN DEFAULT true,
    "clientPosition" TEXT DEFAULT 'right',
    "footerNotes" TEXT,
    "defaultPaymentTerms" TEXT,
    "documentColumns" JSONB,
    "documentLabels" JSONB,
    "showAmountInWords" BOOLEAN DEFAULT true,
    "showSignatureRecipient" BOOLEAN DEFAULT true,
    "priceDisplayMode" TEXT DEFAULT 'HT',
    "defaultCurrencyCode" TEXT DEFAULT 'MAD',
    "invoiceNumbering" JSONB,
    "quoteNumbering" JSONB,
    "deliveryNoteNumbering" JSONB,
    "purchaseOrderNumbering" JSONB,
    "creditNoteNumbering" JSONB,
    "documentInfoPosition" TEXT DEFAULT 'right',
    "showExpiryDate" BOOLEAN DEFAULT true,
    "showUnitInPDF" BOOLEAN DEFAULT true,
    "defaultTva" NUMERIC DEFAULT 20,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- ADD COLUMNS IF TABLES ALREADY EXISTED
ALTER TABLE products ADD COLUMN IF NOT EXISTS "createdAt" TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "hasVariants" BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb;
ALTER TABLE products ADD COLUMN IF NOT EXISTS barcode TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS "imageUrl" TEXT;

ALTER TABLE expenses ADD COLUMN IF NOT EXISTS "purchaseOrderId" TEXT;

ALTER TABLE quotes ADD COLUMN IF NOT EXISTS "showDimensions" BOOLEAN DEFAULT false;
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS "showDimensions" BOOLEAN DEFAULT false;
ALTER TABLE delivery_notes ADD COLUMN IF NOT EXISTS "showDimensions" BOOLEAN DEFAULT false;
ALTER TABLE purchase_orders ADD COLUMN IF NOT EXISTS "showDimensions" BOOLEAN DEFAULT false;
ALTER TABLE credit_notes ADD COLUMN IF NOT EXISTS "showDimensions" BOOLEAN DEFAULT false;

ALTER TABLE settings ADD COLUMN IF NOT EXISTS "logoWidth" NUMERIC DEFAULT 200;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS "showLogoWatermark" BOOLEAN DEFAULT true;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS "logoWatermarkOpacity" NUMERIC DEFAULT 0.07;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS "stampWidth" NUMERIC DEFAULT 220;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS "headerTextColor" TEXT DEFAULT '#ffffff';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS "tableHeaderBgColor" TEXT DEFAULT '#10b981';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS "showTableBorders" BOOLEAN DEFAULT true;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS "clientPosition" TEXT DEFAULT 'right';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS "documentInfoPosition" TEXT DEFAULT 'right';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS "showExpiryDate" BOOLEAN DEFAULT true;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS "defaultTva" NUMERIC DEFAULT 20;

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_clients_company_id ON clients(company_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_company_id ON suppliers(company_id);
CREATE INDEX IF NOT EXISTS idx_products_company_id ON products(company_id);
CREATE INDEX IF NOT EXISTS idx_quotes_company_id ON quotes(company_id);
CREATE INDEX IF NOT EXISTS idx_invoices_company_id ON invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_delivery_notes_company_id ON delivery_notes(company_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_company_id ON purchase_orders(company_id);
CREATE INDEX IF NOT EXISTS idx_credit_notes_company_id ON credit_notes(company_id);
CREATE INDEX IF NOT EXISTS idx_payments_company_id ON payments(company_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_company_id ON stock_movements(company_id);
CREATE INDEX IF NOT EXISTS idx_expenses_company_id ON expenses(company_id);
CREATE INDEX IF NOT EXISTS idx_employees_company_id ON employees(company_id);
CREATE INDEX IF NOT EXISTS idx_attendances_company_id ON attendances(company_id);
CREATE INDEX IF NOT EXISTS idx_salary_payments_company_id ON salary_payments(company_id);
CREATE INDEX IF NOT EXISTS idx_settings_company_id ON settings(company_id);

CREATE INDEX IF NOT EXISTS idx_products_company_pagination ON products(company_id, id);
CREATE INDEX IF NOT EXISTS idx_invoices_company_pagination ON invoices(company_id, id);
CREATE INDEX IF NOT EXISTS idx_quotes_company_pagination ON quotes(company_id, id);
CREATE INDEX IF NOT EXISTS idx_delivery_notes_company_pagination ON delivery_notes(company_id, id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_company_pagination ON purchase_orders(company_id, id);
CREATE INDEX IF NOT EXISTS idx_credit_notes_company_pagination ON credit_notes(company_id, id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_company_pagination ON stock_movements(company_id, id);
CREATE INDEX IF NOT EXISTS idx_payments_company_pagination ON payments(company_id, id);
CREATE INDEX IF NOT EXISTS idx_expenses_company_pagination ON expenses(company_id, id);

CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_code ON products("productCode");
CREATE INDEX IF NOT EXISTS idx_clients_code ON clients("clientCode");

-- ROW LEVEL SECURITY (RLS)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
    t text;
    tables text[] := ARRAY[
        'clients', 'suppliers', 'products', 'quotes', 'invoices',
        'delivery_notes', 'purchase_orders', 'credit_notes', 'payments',
        'stock_movements', 'expenses', 'employees', 'attendances',
        'salary_payments', 'settings'
    ];
BEGIN
    FOREACH t IN ARRAY tables LOOP
        EXECUTE format('DROP POLICY IF EXISTS "Enable full access for authenticated users" ON %I;', t);
        EXECUTE format('DROP POLICY IF EXISTS "Enable full access for all users" ON %I;', t);
        EXECUTE format('DROP POLICY IF EXISTS "Allow all operations" ON %I;', t);
        EXECUTE format('
            CREATE POLICY "Allow all operations" ON %I
            FOR ALL 
            TO public
            USING (true)
            WITH CHECK (true);
        ', t);
    END LOOP;
END $$;
`;

const Settings: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [copiedSQL, setCopiedSQL] = useState(false);
    const [showSQLPreview, setShowSQLPreview] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const handleCopySQL = async () => {
        try {
            await navigator.clipboard.writeText(SUPABASE_FULL_SQL_SCHEMA);
            setCopiedSQL(true);
            setFeedback({ type: 'success', message: 'Script SQL copié dans le presse-papiers ! Collez-le dans SQL Editor de Supabase.' });
            setTimeout(() => setCopiedSQL(false), 3000);
        } catch (err) {
            console.error('Copy failed:', err);
            setFeedback({ type: 'error', message: 'Échec de la copie automatique. Utilisez le bouton Télécharger SQL.' });
        }
    };

    const handleDownloadSQL = () => {
        const blob = new Blob([SUPABASE_FULL_SQL_SCHEMA], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `facturago-supabase-schema-${new Date().toISOString().split('T')[0]}.sql`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setFeedback({ type: 'success', message: 'Fichier supabase_schema.sql téléchargé avec succès !' });
    };

    const handleExport = async () => {
        setIsLoading(true);
        setFeedback(null);
        try {
            const data = await dbService.getAllData();
            const jsonString = JSON.stringify(data, null, 2);
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `facturago-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setFeedback({ type: 'success', message: 'Exportation réussie !' });
        } catch (error) {
            console.error('Failed to export data:', error);
            setFeedback({ type: 'error', message: 'Échec de l\'exportation des données.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') {
                    throw new Error("Le fichier est invalide.");
                }
                const data = JSON.parse(text);

                const confirmed = window.confirm(
                    "Êtes-vous sûr de vouloir importer ces données ?\n\nATTENTION : Toutes les données actuelles seront remplacées par le contenu de ce fichier. Cette action est irréversible."
                );

                if (confirmed) {
                    setIsLoading(true);
                    setFeedback(null);
                    await dbService.clearAllData();
                    for (const storeName in data) {
                        if (data.hasOwnProperty(storeName)) {
                            await dbService.bulkAdd(storeName, data[storeName]);
                        }
                    }
                    setFeedback({ type: 'success', message: 'Importation réussie ! Veuillez rafraîchir la page pour voir les changements.' });
                    setTimeout(() => window.location.reload(), 1500);
                }

            } catch (error) {
                console.error('Failed to import data:', error);
                setFeedback({ type: 'error', message: `Échec de l'importation. Assurez-vous que le fichier est un JSON valide. Erreur: ${error}` });
            } finally {
                setIsLoading(false);
            }
        };
        reader.readAsText(file);
        // Reset file input to allow re-uploading the same file
        event.target.value = '';
    };

    const tablesList = [
        { name: 'clients', desc: 'Clients & contacts (Entreprise, Particulier, ICE, RC)' },
        { name: 'suppliers', desc: 'Fournisseurs & coordonnées' },
        { name: 'products', desc: 'Produits, services, codes-barres, variantes & stocks' },
        { name: 'quotes', desc: 'Devis & articles chiffrés' },
        { name: 'invoices', desc: 'Factures de vente, échéances & statuts' },
        { name: 'delivery_notes', desc: 'Bons de livraison (BL)' },
        { name: 'purchase_orders', desc: 'Bons de commande fournisseurs (BC)' },
        { name: 'credit_notes', desc: 'Avoirs & remboursements' },
        { name: 'payments', desc: 'Paiements & règlements' },
        { name: 'stock_movements', desc: 'Historique des mouvements de stock' },
        { name: 'expenses', desc: 'Dépenses & charges d\'exploitation' },
        { name: 'employees', desc: 'Gestion du personnel & salaires' },
        { name: 'attendances', desc: 'Pointage & présences' },
        { name: 'salary_payments', desc: 'Bulletins & règlements des salaires' },
        { name: 'settings', desc: 'Configuration entreprise, logo, cachet, TVA & numérotation' }
    ];

    return (
        <div className="space-y-6">
            <Header title="Base de Données & Sauvegardes" />
            
            {feedback && (
                 <div className={`p-4 mb-4 text-sm rounded-xl flex items-center gap-3 ${feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`} role="alert">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                    <span className="font-medium">{feedback.message}</span>
                </div>
            )}

            {/* Supabase Database Provisioning Card */}
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-neutral-200 p-6">
                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                            <Database className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-neutral-900">Schéma SQL Supabase (15 Tables & Options)</h3>
                            <p className="text-sm text-neutral-500">
                                Synchronisez et créez toutes les tables, colonnes, index et règles RLS dans votre projet Supabase.
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleCopySQL}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-sm transition-all"
                        >
                            {copiedSQL ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            <span>{copiedSQL ? 'Copié !' : 'Copier le script SQL'}</span>
                        </button>
                        
                        <button
                            type="button"
                            onClick={handleDownloadSQL}
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-800 font-semibold text-sm shadow-sm transition-all"
                        >
                            <FileCode className="w-4 h-4 text-emerald-600" />
                            <span>Télécharger .sql</span>
                        </button>
                    </div>
                </div>

                {/* Steps guide */}
                <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700">
                    <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <Server className="w-4 h-4 text-emerald-600" />
                        Comment enregistrer les tables dans votre nouveau Supabase :
                    </h4>
                    <ol className="list-decimal list-inside space-y-1.5 text-slate-600 pl-1">
                        <li>Ouvrez votre console <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-emerald-600 font-semibold underline">Supabase Dashboard</a>.</li>
                        <li>Dans le menu de gauche, cliquez sur <strong>SQL Editor</strong> puis <strong>New query</strong>.</li>
                        <li>Cliquez sur le bouton vert <strong>« Copier le script SQL »</strong> ci-dessus, puis collez le texte dans l'éditeur.</li>
                        <li>Cliquez sur <strong>Run</strong> (Exécuter). Toutes les 15 tables, colonnes, types, index et politiques de sécurité seront créées instantanément !</li>
                    </ol>
                </div>

                {/* Tables Grid */}
                <div className="mt-6">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                            15 Tables Incluses dans le Schéma
                        </span>
                        <button 
                            type="button"
                            onClick={() => setShowSQLPreview(!showSQLPreview)} 
                            className="text-xs font-semibold text-emerald-600 hover:underline"
                        >
                            {showSQLPreview ? 'Masquer le code SQL' : 'Afficher le code SQL brut'}
                        </button>
                    </div>

                    {showSQLPreview ? (
                        <pre className="p-4 bg-slate-900 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto max-h-96 custom-scrollbar">
                            {SUPABASE_FULL_SQL_SCHEMA}
                        </pre>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {tablesList.map((tbl) => (
                                <div key={tbl.name} className="p-3 rounded-xl border border-neutral-200 bg-neutral-50/50 hover:bg-white transition-all">
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                                            {tbl.name}
                                        </span>
                                        <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                                    </div>
                                    <p className="text-xs text-neutral-600 mt-1.5 line-clamp-1">{tbl.desc}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Local Backup and Restore */}
            <div className="bg-white rounded-2xl shadow-sm ring-1 ring-neutral-200 p-6">
                <h3 className="text-lg font-bold text-neutral-900">Sauvegarde et Restauration des Données</h3>
                <p className="mt-1 text-sm text-neutral-500">
                    Exportez toutes vos données clients, factures, devis et stocks sous format JSON ou restaurez-les en un clic.
                </p>

                <div className="mt-6 flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleExport}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center gap-x-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 disabled:bg-neutral-400 transition-all duration-200 ease-in-out"
                    >
                        <Download className="-ml-1 h-5 w-5" />
                        <span>{isLoading ? 'Exportation...' : 'Exporter les données (JSON)'}</span>
                    </button>

                    <button
                        onClick={handleImportClick}
                        disabled={isLoading}
                        className="inline-flex items-center justify-center gap-x-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-50 disabled:opacity-50 transition-all duration-200 ease-in-out"
                    >
                        <Upload className="-ml-1 h-5 w-5" />
                        <span>{isLoading ? 'Importation...' : 'Importer les données (JSON)'}</span>
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="application/json"
                    />
                </div>

                 <div className="mt-6 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-5 w-5 text-amber-500" aria-hidden="true" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-amber-800">
                                <span className="font-bold">Important :</span> L'importation de données effacera toutes les informations actuellement enregistrées dans l'application pour les remplacer par le contenu du fichier JSON. Pensez à exporter vos données actuelles avant d'en importer de nouvelles.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;