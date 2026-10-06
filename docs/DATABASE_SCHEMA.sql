-- ============================================================================
-- ESTATEPULSE PRODUCTION-GRADE DATABASE SCHEMA
-- Engine: PostgreSQL 16+
-- Extensions: postgis, pgvector, uuid-ossp, pg_trgm, btree_gist
-- ============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- 2. ENUMS
CREATE TYPE user_role_enum AS ENUM ('buyer', 'seller', 'agent', 'broker', 'admin');
CREATE TYPE property_type_enum AS ENUM ('apartment', 'villa', 'residence', 'penthouse', 'commercial', 'land', 'building');
CREATE TYPE listing_type_enum AS ENUM ('sale', 'rent', 'daily_rental');
CREATE TYPE listing_status_enum AS ENUM ('draft', 'pending_approval', 'active', 'under_offer', 'sold', 'rented', 'inactive');
CREATE TYPE media_type_enum AS ENUM ('photo', 'panorama_360', 'matterport_3d', 'video', 'floor_plan');
CREATE TYPE offer_status_enum AS ENUM ('pending', 'countered', 'accepted', 'rejected', 'expired', 'withdrawn');
CREATE TYPE tour_type_enum AS ENUM ('in_person', 'live_video', 'self_guided_360');
CREATE TYPE appointment_status_enum AS ENUM ('requested', 'confirmed', 'rescheduled', 'completed', 'cancelled');
CREATE TYPE doping_type_enum AS ENUM ('homepage_showcase', 'ai_top_pick', 'urgent_deal', 'map_pin_highlight', 'push_notification_blast');

-- 3. CORE USER & AGENCY TABLES
CREATE TABLE brokerages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    tax_number VARCHAR(50),
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    logo_url TEXT,
    address TEXT,
    rating_avg NUMERIC(3, 2) DEFAULT 0.00,
    review_count INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(30) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    avatar_url TEXT,
    role user_role_enum DEFAULT 'buyer',
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_phone_verified BOOLEAN DEFAULT FALSE,
    is_identity_verified BOOLEAN DEFAULT FALSE, -- e-Devlet / KYC Doğrulaması
    kyc_document_hash VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE agent_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    brokerage_id UUID REFERENCES brokerages(id) ON DELETE SET NULL,
    license_number VARCHAR(100) UNIQUE,
    bio TEXT,
    languages VARCHAR(100)[] DEFAULT ARRAY['Türkçe'],
    specialties VARCHAR(100)[] DEFAULT ARRAY['Konut'],
    service_areas VARCHAR(100)[] DEFAULT ARRAY['İstanbul - Kadıköy'],
    total_sales_count INT DEFAULT 0,
    total_volume_try NUMERIC(15, 2) DEFAULT 0.00,
    avg_rating NUMERIC(3, 2) DEFAULT 5.00,
    review_count INT DEFAULT 0,
    response_rate_percent INT DEFAULT 98,
    response_time_minutes INT DEFAULT 15,
    is_top_producer BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. BÖLGESEL VE ÇEVRESEL YAŞAM ANALİTİĞİ (LIFESTYLE MATRIX)
CREATE TABLE neighborhoods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    neighborhood_name VARCHAR(150) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    boundary_geom GEOMETRY(MultiPolygon, 4326),
    center_geom GEOMETRY(Point, 4326),
    walk_score INT CHECK (walk_score BETWEEN 0 AND 100),
    transit_score INT CHECK (transit_score BETWEEN 0 AND 100),
    school_score INT CHECK (school_score BETWEEN 0 AND 100),
    safety_score INT CHECK (safety_score BETWEEN 0 AND 100),
    green_space_score INT CHECK (green_space_score BETWEEN 0 AND 100),
    earthquake_soil_risk_score NUMERIC(3,1), -- 1.0 (Çok Sağlam) - 5.0 (Yüksek Risk)
    avg_price_per_sqm_sale NUMERIC(12, 2),
    avg_price_per_sqm_rent NUMERIC(12, 2),
    annual_appreciation_rate NUMERIC(5, 2), -- Örn: 42.50 (%)
    demographics_json JSONB, -- Gelir seviyesi, yaş dağılımı, eğitim seviyesi
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. İLANLAR (PROPERTIES) & COĞRAFİ TABLO
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    assigned_agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
    neighborhood_id UUID REFERENCES neighborhoods(id) ON DELETE SET NULL,
    
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(300) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    
    property_type property_type_enum NOT NULL,
    listing_type listing_type_enum NOT NULL,
    status listing_status_enum DEFAULT 'active',
    
    -- Fiyatlandırma
    price NUMERIC(14, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    dues_amount NUMERIC(10, 2) DEFAULT 0.00, -- Aidat
    deposit_amount NUMERIC(10, 2) DEFAULT 0.00, -- Depozito
    price_per_net_sqm NUMERIC(12, 2) GENERATED ALWAYS AS (
        CASE WHEN net_sqm > 0 THEN price / net_sqm ELSE NULL END
    ) STORED,

    -- Mimari ve Yapı Özellikleri
    gross_sqm NUMERIC(8, 2) NOT NULL,
    net_sqm NUMERIC(8, 2) NOT NULL,
    room_count VARCHAR(20) NOT NULL, -- '3+1', '4+2', '1+0 (Stüdyo)'
    bedrooms SMALLINT DEFAULT 1,
    bathrooms SMALLINT DEFAULT 1,
    floor_number SMALLINT,
    total_floors SMALLINT,
    building_age SMALLINT DEFAULT 0,
    heating_type VARCHAR(50) DEFAULT 'Kombi (Doğalgaz)',
    has_balcony BOOLEAN DEFAULT FALSE,
    has_elevator BOOLEAN DEFAULT TRUE,
    has_parking BOOLEAN DEFAULT FALSE,
    is_furnished BOOLEAN DEFAULT FALSE,
    deed_status VARCHAR(50) DEFAULT 'Kat Mülkiyeti',
    suitable_for_bank_loan BOOLEAN DEFAULT TRUE,
    
    -- Coğrafi Konum (PostGIS)
    location_geom GEOMETRY(Point, 4326) NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    address_line TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    district VARCHAR(100) NOT NULL,
    neighborhood VARCHAR(150) NOT NULL,
    postal_code VARCHAR(20),
    
    -- Yapay Zeka Özellikleri (Embeddings & AVM)
    embedding vector(1536), -- text-embedding-3-large veya bge-m3 için semantik vektör
    visual_condition_score NUMERIC(3, 2), -- 1.00 - 5.00 arası AI oda/lüks derecelendirmesi
    has_virtual_staging BOOLEAN DEFAULT FALSE,
    virtual_tour_available BOOLEAN DEFAULT FALSE,
    
    -- Platform Rozetleri ve Dopingler
    is_featured BOOLEAN DEFAULT FALSE,
    is_urgent BOOLEAN DEFAULT FALSE,
    is_verified_listing BOOLEAN DEFAULT FALSE, -- Tapu / e-Devlet sorgusu başarılı
    view_count INT DEFAULT 0,
    favorite_count INT DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. İLAN MEDYALARI & VIRTUAL STAGING
CREATE TABLE property_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    media_type media_type_enum DEFAULT 'photo',
    url TEXT NOT NULL,
    thumbnail_url TEXT,
    original_file_name VARCHAR(255),
    display_order INT DEFAULT 0,
    is_cover_photo BOOLEAN DEFAULT FALSE,
    
    -- Virtual Staging (Sanal Mobilyalama Çiftleri)
    is_virtual_staged BOOLEAN DEFAULT FALSE,
    original_empty_image_url TEXT,
    staging_style VARCHAR(50), -- 'scandinavian', 'modern_luxury', 'minimalist'
    
    -- 360 & Matterport
    matterport_sid VARCHAR(100),
    panorama_fov INT DEFAULT 90,
    
    ai_detected_tags TEXT[] DEFAULT ARRAY[]::TEXT[], -- ['mutfak', 'ada_tezgah', 'granit', 'spot_aydinlatma']
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 7. FİYAT GEÇMİŞİ LOGLARI (PRICE TRACKING)
CREATE TABLE property_price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    old_price NUMERIC(14, 2) NOT NULL,
    new_price NUMERIC(14, 2) NOT NULL,
    price_difference NUMERIC(14, 2) GENERATED ALWAYS AS (new_price - old_price) STORED,
    percentage_change NUMERIC(6, 2),
    currency VARCHAR(3) DEFAULT 'TRY',
    changed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. ESTATEPULSE AI DEĞERLEME (AVM MOTORU VERİLERİ)
CREATE TABLE property_avm_valuations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    estimated_market_value NUMERIC(14, 2) NOT NULL,
    confidence_interval_low NUMERIC(14, 2) NOT NULL,
    confidence_interval_high NUMERIC(14, 2) NOT NULL,
    confidence_score_percent INT CHECK (confidence_score_percent BETWEEN 0 AND 100), -- Örn: %94
    estimated_rental_yield_monthly NUMERIC(10, 2),
    projected_appreciation_1y_percent NUMERIC(5, 2), -- 1 Yıllık Tahmini Artış
    projected_appreciation_3y_percent NUMERIC(5, 2), -- 3 Yıllık Tahmini Artış
    shap_feature_importance JSONB, -- Hangi faktörün fiyatı ne kadar etkilediği (m2: +20%, metro: +15%, yaş: -8%)
    comparables_property_ids UUID[] DEFAULT ARRAY[]::UUID[], -- Emsal gösterilen ilan ID'leri
    model_version VARCHAR(50) NOT NULL DEFAULT 'v2.4-catboost-spatial',
    calculated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. ŞEFFAF TEKLİF & DİJİTAL PAZARLIK (OFFERS & NEGOTIATION)
CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE RESTRICT,
    buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    seller_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    current_amount NUMERIC(14, 2) NOT NULL,
    original_offer_amount NUMERIC(14, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    earnest_money_deposit NUMERIC(10, 2) DEFAULT 0.00, -- Dijital Kapora Taahhüdü
    mortgage_contingency BOOLEAN DEFAULT FALSE, -- Kredi onayı şartı var mı?
    current_status offer_status_enum DEFAULT 'pending',
    active_until TIMESTAMPTZ NOT NULL, -- Teklifin geçerlilik süresi (Örn: 48 Saat)
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE offer_negotiation_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_id UUID NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
    action_by_user_id UUID NOT NULL REFERENCES users(id),
    action_type VARCHAR(50) NOT NULL, -- 'INITIAL_OFFER', 'COUNTER_OFFER', 'ACCEPTED', 'REJECTED'
    amount NUMERIC(14, 2) NOT NULL,
    message_note TEXT,
    counter_expiry_date TIMESTAMPTZ,
    timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. RANDEVU & CANLI TUR PLANLAYICI (TOURS & APPOINTMENTS)
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    requester_user_id UUID NOT NULL REFERENCES users(id),
    host_agent_id UUID NOT NULL REFERENCES users(id),
    tour_type tour_type_enum DEFAULT 'in_person',
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ NOT NULL,
    status appointment_status_enum DEFAULT 'requested',
    meeting_link TEXT, -- Online tur için Zoom/WebRTC linki
    visitor_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 11. MONETIZATION, SUBSCRIPTIONS & DOPINGLER
CREATE TABLE membership_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(100) NOT NULL,
    role_target user_role_enum NOT NULL, -- 'agent', 'broker', 'seller'
    monthly_price NUMERIC(10, 2) NOT NULL,
    annual_price NUMERIC(10, 2) NOT NULL,
    active_listing_limit INT NOT NULL,
    ai_valuation_reports_monthly INT DEFAULT 10,
    virtual_staging_credits_monthly INT DEFAULT 5,
    featured_doping_credits INT DEFAULT 2,
    lead_distribution_priority INT DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    package_id UUID NOT NULL REFERENCES membership_packages(id),
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'cancelled', 'past_due'
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    auto_renew BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE doping_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    doping_type doping_type_enum NOT NULL,
    start_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMPTZ NOT NULL,
    price_paid NUMERIC(10, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'paid'
);

-- 12. PERFORMANS VE ARAMA İNDEKSLERİ (INDEXES)
-- PostGIS Coğrafi İndeks
CREATE INDEX idx_properties_location_geom ON properties USING GIST (location_geom);
CREATE INDEX idx_neighborhoods_boundary ON neighborhoods USING GIST (boundary_geom);
CREATE INDEX idx_neighborhoods_center ON neighborhoods USING GIST (center_geom);

-- pgvector HNSW İndeksi (Yüksek Boyutlu Semantik Benzerlik)
CREATE INDEX idx_properties_embedding_hnsw ON properties USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- Metin Arama & Filtreleme İndeksleri
CREATE INDEX idx_properties_status_price ON properties (status, price);
CREATE INDEX idx_properties_city_district ON properties (city, district, neighborhood);
CREATE INDEX idx_properties_title_trgm ON properties USING gin (title gin_trgm_ops);
CREATE INDEX idx_offers_property_status ON offers (property_id, current_status);
CREATE INDEX idx_appointments_agent_schedule ON appointments (host_agent_id, scheduled_start);

-- 13. OTOMATİK FİYAT DEĞİŞİM TRİGGER'I
CREATE OR REPLACE FUNCTION log_property_price_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.price <> NEW.price THEN
        INSERT INTO property_price_history (
            property_id,
            old_price,
            new_price,
            percentage_change,
            currency
        ) VALUES (
            OLD.id,
            OLD.price,
            NEW.price,
            ROUND(((NEW.price - OLD.price) / OLD.price) * 100, 2),
            NEW.currency
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_property_price_change
BEFORE UPDATE ON properties
FOR EACH ROW
EXECUTE FUNCTION log_property_price_change();
