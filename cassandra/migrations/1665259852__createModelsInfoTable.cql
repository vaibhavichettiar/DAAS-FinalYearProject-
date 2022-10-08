create TABLE IF NOT EXISTS daas_data.modelsinfo (
    id UUID,
    productid int,
    filename text,
    PRIMARY KEY (id, productid)
);