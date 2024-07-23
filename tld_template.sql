INSERT INTO public.blocktime_ingestor_status (chain, block_number, paused, created_at, updated_at) VALUES (1018, 3429398, false, now(), now());

INSERT INTO public.event_group_sync_status (chain, protocol, block_number, paused, created_at, updated_at)
VALUES (1018, 20, 3429398, false, now(), now());
INSERT INTO public.event_group_sync_status (chain, protocol, block_number, paused, created_at, updated_at)
VALUES (1018, 22, 3429398, false, now(), now());
INSERT INTO public.event_group_sync_status (chain, protocol, block_number, paused, created_at, updated_at)
VALUES (1018, 23, 3429398, false, now(), now());
INSERT INTO public.event_group_sync_status (chain, protocol, block_number, paused, created_at, updated_at)
VALUES (1018, 24, 3429398, false, now(), now());
INSERT INTO public.event_group_sync_status (chain, protocol, block_number, paused, created_at, updated_at)
VALUES (1018, 15, 3429398, false, now(), now());
INSERT INTO public.event_group_sync_status (chain, protocol, block_number, paused, created_at, updated_at)
VALUES (1018, 11, 3429398, false, now(), now());
INSERT INTO public.event_group_sync_status (chain, protocol, block_number, paused, created_at, updated_at)
VALUES (1018, 16, 3429398, false, now(), now());

INSERT INTO public.event_group_consumer_status (chain, protocol, block_number, paused, created_at, updated_at)
VALUES (1018, 20, 3429398, false, now(), now());
INSERT INTO public.event_group_consumer_status (chain, protocol, block_number, paused, created_at, updated_at)
VALUES (1018, 22, 3429398, false, now(), now());
INSERT INTO public.event_group_consumer_status (chain, protocol, block_number, paused, created_at, updated_at)
VALUES (1018, 23, 3429398, false, now(), now());
INSERT INTO public.event_group_consumer_status (chain, protocol, block_number, paused, created_at, updated_at)
VALUES (1018, 24, 3429398, false, now(), now());
INSERT INTO public.event_group_consumer_status (chain, protocol, block_number, paused, created_at, updated_at)
VALUES (1018, 15, 3429398, false, now(), now());
INSERT INTO public.event_group_consumer_status (chain, protocol, block_number, paused, created_at, updated_at)
VALUES (1018, 11, 3429398, false, now(), now());
INSERT INTO public.event_group_consumer_status (chain, protocol, block_number, paused, created_at, updated_at)
VALUES (1018, 16, 3429398, false, now(), now());

CREATE TABLE block_times_ailayer_0_50000000 PARTITION OF block_times FOR VALUES FROM (1018, 0) TO (1018, 50000000);
CREATE TABLE block_times_ailayer_50000000_150000000 PARTITION OF block_times FOR VALUES FROM (1018, 50000000) TO (1018, 150000000);
CREATE TABLE block_times_ailayer_150000000_250000000 PARTITION OF block_times FOR VALUES FROM (1018, 150000000) TO (1018, 250000000);
CREATE TABLE block_times_ailayer_250000000_350000000 PARTITION OF block_times FOR VALUES FROM (1018, 250000000) TO (1018, 350000000);
CREATE TABLE block_times_ailayer_350000000_450000000 PARTITION OF block_times FOR VALUES FROM (1018, 350000000) TO (1018, 450000000);
CREATE TABLE block_times_ailayer_450000000_550000000 PARTITION OF block_times FOR VALUES FROM (1018, 450000000) TO (1018, 550000000);

CREATE TABLE chain_events_ailayer_0_80m PARTITION OF chain_events FOR VALUES FROM (1018, 0) TO (1018, 80000000);
CREATE TABLE chain_events_ailayer_80m_110m PARTITION OF chain_events FOR VALUES FROM (1018, 80000000) TO (1018, 110000000);
CREATE TABLE chain_events_ailayer_110m_140m PARTITION OF chain_events FOR VALUES FROM (1018, 110000000) TO (1018, 140000000);
CREATE TABLE chain_events_ailayer_140m_170m PARTITION OF chain_events FOR VALUES FROM (1018, 140000000) TO (1018, 170000000);
CREATE TABLE chain_events_ailayer_170m_200m PARTITION OF chain_events FOR VALUES FROM (1018, 170000000) TO (1018, 200000000);

CREATE TABLE consume_change_logs_ailayer_0_50000000 PARTITION OF consume_change_logs FOR VALUES FROM (1018, 0) TO (1018, 50000000);
CREATE TABLE consume_change_logs_ailayer_50000000_150000000 PARTITION OF consume_change_logs FOR VALUES FROM (1018, 50000000) TO (1018, 150000000);
CREATE TABLE consume_change_logs_ailayer_150000000_350000000 PARTITION OF consume_change_logs FOR VALUES FROM (1018, 150000000) TO (1018, 250000000);
CREATE TABLE consume_change_logs_ailayer_250000000_350000000 PARTITION OF consume_change_logs FOR VALUES FROM (1018, 250000000) TO (1018, 350000000);
CREATE TABLE consume_change_logs_ailayer_350000000_450000000 PARTITION OF consume_change_logs FOR VALUES FROM (1018, 350000000) TO (1018, 450000000);
CREATE TABLE consume_change_logs_ailayer_450000000_550000000 PARTITION OF consume_change_logs FOR VALUES FROM (1018, 450000000) TO (1018, 550000000);


INSERT INTO public.chain_event_sync_status (chain, block_number, paused, created_at, updated_at)
VALUES (1018, 3429398, false, now(), now());
INSERT INTO public.chain_event_consumer_status (chain, block_number, paused, created_at, updated_at)
VALUES (1018, 3429398, false, now(), now());

