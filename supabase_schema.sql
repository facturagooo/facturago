-- ==============================================================================
-- FACTURAGO SAAS - SCRIPT DE CRÉATION COMPLET DE LA BASE DE DONNÉES SUPABASE
-- Toutes les tables, colonnes, types, index, options et politiques de sécurité (RLS)
-- ==============================================================================

-- 1. ACTIVER LES EXTENSIONS NÉCESSAIRES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. CRÉATION DES 15 TABLES DU SAAS
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- TABLE 1: clients (Clients)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- TABLE 2: suppliers (Fournisseurs)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- TABLE 3: products (Produits et Services + Variantes + Code-barres)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- TABLE 4: quotes (Devis)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- TABLE 5: invoices (Factures)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- TABLE 6: delivery_notes (Bons de Livraison)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- TABLE 7: purchase_orders (Bons de Commande Fournisseur)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- TABLE 8: credit_notes (Avoirs)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- TABLE 9: payments (Paiements Clients)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- TABLE 10: stock_movements (Mouvements de Stock)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- TABLE 11: expenses (Dépenses / Charges)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- TABLE 12: employees (Personnel / Salariés)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- TABLE 13: attendances (Présences et Absences)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- TABLE 14: salary_payments (Paiements des Salaires)
-- ------------------------------------------------------------------------------
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

-- ------------------------------------------------------------------------------
-- TABLE 15: settings (Paramètres Entreprise & Personnalisation Facturago)
-- ------------------------------------------------------------------------------
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

-- ==============================================================================
-- 3. AJOUT DES COLONNES SI TABLES EXISTAIENT DÉJÀ (MIGRATIONS / IDEMPOTENT)
-- ==============================================================================
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

-- ==============================================================================
-- 4. CRÉATION DES INDEX DE PERFORMANCE
-- ==============================================================================
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

-- Index composites pour pagination rapide et scans indexés
CREATE INDEX IF NOT EXISTS idx_products_company_pagination ON products(company_id, id);
CREATE INDEX IF NOT EXISTS idx_invoices_company_pagination ON invoices(company_id, id);
CREATE INDEX IF NOT EXISTS idx_quotes_company_pagination ON quotes(company_id, id);
CREATE INDEX IF NOT EXISTS idx_delivery_notes_company_pagination ON delivery_notes(company_id, id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_company_pagination ON purchase_orders(company_id, id);
CREATE INDEX IF NOT EXISTS idx_credit_notes_company_pagination ON credit_notes(company_id, id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_company_pagination ON stock_movements(company_id, id);
CREATE INDEX IF NOT EXISTS idx_payments_company_pagination ON payments(company_id, id);
CREATE INDEX IF NOT EXISTS idx_expenses_company_pagination ON expenses(company_id, id);

-- Index pour recherche de codes et code-barres
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_code ON products("productCode");
CREATE INDEX IF NOT EXISTS idx_clients_code ON clients("clientCode");

-- ==============================================================================
-- 5. CONFIGURATION DU ROW LEVEL SECURITY (RLS) & POLICIES
-- ==============================================================================

-- Activation RLS sur toutes les tables
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

-- Politiques RLS universelles pour chaque table (Support complet anon & authenticated)
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

-- ==============================================================================
-- 6. MESSAGE DE CONFIRMATION
-- ==============================================================================
SELECT 'Facturago Database Schema setup completed successfully! 15 tables and all indexes/RLS created.' as status;
