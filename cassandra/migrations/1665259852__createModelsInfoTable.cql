create TABLE daas_ks.modelsinfo (
    id UUID,
    productid int,
    filename text,
    PRIMARY KEY (id, productid)
);