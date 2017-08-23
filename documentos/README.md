# SQL


```sql

CREATE TABLE Pais (
    id serial PRIMARY KEY,
    nome char(3)
);

CREATE TABLE Estado (
    id serial PRIMARY KEY,
    nome char(2),
    FK_Pais_id serial
);

CREATE TABLE Cidade (
    id serial PRIMARY KEY,
    nome varchar(50),
    FK_Estado_id serial
);

CREATE TABLE Categoria (
    id serial PRIMARY KEY,
    nome varchar(50),
    tipo varchar(50)
);

CREATE TABLE Imovel (
    id serial PRIMARY KEY,
    preco Int,
    area int,
    data date,
    FK_Cidade_id serial
);

CREATE TABLE Cat_imo (
    FK_Categoria_id serial,
    FK_Imovel_id serial
);
 
ALTER TABLE Estado ADD CONSTRAINT FK_Estado_1
    FOREIGN KEY (FK_Pais_id)
    REFERENCES Pais (id);
 
ALTER TABLE Cidade ADD CONSTRAINT FK_Cidade_1
    FOREIGN KEY (FK_Estado_id)
    REFERENCES Estado (id);
 
ALTER TABLE Imovel ADD CONSTRAINT FK_Imovel_1
    FOREIGN KEY (FK_Cidade_id)
    REFERENCES Cidade (id);
 
ALTER TABLE Cat_imo ADD CONSTRAINT FK_Cat_imo_0
    FOREIGN KEY (FK_Categoria_id)
    REFERENCES Categoria (id);
 
ALTER TABLE Cat_imo ADD CONSTRAINT FK_Cat_imo_1
    FOREIGN KEY (FK_Imovel_id)
    REFERENCES Imovel (id);
```
