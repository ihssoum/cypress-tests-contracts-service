SELECT table_name, column_name, data_type
FROM information_schema.columns
WHERE table_name IN ('DISPOSITIF_VALIDATION', 'PRODUIT_SOUSCRIPTION', 'UTILISATEUR','RELATION_COMMERCIALE','COMPTE','')
ORDER BY table_name, ordinal_position;
