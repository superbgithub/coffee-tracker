-- Coffee Tracker - Initial Schema
-- V1: Create coffee_consumptions table

CREATE TABLE IF NOT EXISTS coffee_consumptions (
    id BIGSERIAL PRIMARY KEY,
    coffee_type VARCHAR(50) NOT NULL,
    size VARCHAR(20) NOT NULL,
    caffeine_mg INTEGER NOT NULL,
    consumed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_consumed_at ON coffee_consumptions(consumed_at DESC);
CREATE INDEX idx_coffee_type ON coffee_consumptions(coffee_type);
CREATE INDEX idx_created_at ON coffee_consumptions(created_at);

-- Comments for documentation
COMMENT ON TABLE coffee_consumptions IS 'Tracks all coffee consumption events';
COMMENT ON COLUMN coffee_consumptions.coffee_type IS 'Type of coffee: Espresso, Latte, Cappuccino, etc.';
COMMENT ON COLUMN coffee_consumptions.size IS 'Size: Small, Medium, Large';
COMMENT ON COLUMN coffee_consumptions.caffeine_mg IS 'Caffeine content in milligrams';
COMMENT ON COLUMN coffee_consumptions.consumed_at IS 'When the coffee was consumed';
COMMENT ON COLUMN coffee_consumptions.created_at IS 'When the record was created';
