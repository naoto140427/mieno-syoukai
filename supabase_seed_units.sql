INSERT INTO units (slug, unit_name, owner_id, odometer)
VALUES
  ('cbr600rr', 'CBR600RR', 'CMO', 0),
  ('monkey-125', 'Monkey 125', 'CMO', 0),
  ('serena', 'SERENA e-POWER', 'CEO', 0)
ON CONFLICT (slug) DO UPDATE SET
  unit_name = EXCLUDED.unit_name,
  owner_id = EXCLUDED.owner_id;
