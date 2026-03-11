-- Ensure `transactions.reference` is globally unique.
-- 1) Check duplicates first. If this returns rows, resolve them before step 2.
SELECT reference, COUNT(*) AS duplicate_count
FROM transactions
GROUP BY reference
HAVING COUNT(*) > 1;

-- 2) Enforce uniqueness at DB level.
ALTER TABLE transactions
ADD CONSTRAINT uq_transactions_reference UNIQUE (reference);
