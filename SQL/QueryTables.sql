-- Creazione Tabella(SQL)
DROP TABLE IF EXISTS `Follower`;
DROP TABLE IF EXISTS `Like`;
DROP TABLE IF EXISTS `Commenti`;
DROP TABLE IF EXISTS `Post`;
DROP TABLE IF EXISTS `Utente`;


-- Creazione Tabella Utente
CREATE TABLE `Utente` (
    `Username` varchar(20) NOT NULL PRIMARY KEY,
    `Email` varchar(100) NOT NULL UNIQUE,
    `Password` varchar(20) NOT NULL,
    `Nome` VARCHAR(50) NOT NULL,
    `Cognome` VARCHAR(50) NOT NULL,
    `DataNascita` DATE NOT NULL,
    `Genere` VARCHAR(10) NOT NULL,
    `Tipo_Utente` VARCHAR(10) NOT NULL,
    `Immagine_Profilo` VARCHAR(1000) NULL,
    `Telefono` VARCHAR(10) NULL,
    `Biografia` VARCHAR(150) NULL
)ENGINE=InnoDB;

CREATE TABLE `Follower` (
    `Id_Follower` varchar(10) NOT NULL PRIMARY KEY,
    `Data_Follow` DATE NOT NULL,
    `Username` varchar(10) NOT NULL,
    CONSTRAINT `FK_Utente_F` FOREIGN KEY (`Username`) REFERENCES `Utente`(`Username`)
    on update cascade
    on delete no action
)ENGINE=InnoDB;

CREATE TABLE `Post` (
    `Id_Post` varchar(10) NOT NULL PRIMARY KEY,
    `Data_Post` DATE NOT NULL,
    `Username` varchar(10) NOT NULL,
    `Foto_Post` VARCHAR(1000) NOT NULL,
    `Descrizione` VARCHAR(100) NULL,
    CONSTRAINT `FK_Utente_P` FOREIGN KEY (`Username`) REFERENCES `Utente`(`Username`)
    on update cascade
    on delete no action
)ENGINE=InnoDB;

CREATE TABLE `Like` (
    `Id_Like` varchar(10) NOT NULL PRIMARY KEY,
    `Data_Like` DATE NOT NULL,
    `Username` varchar(10) NOT NULL,
    `Id_Post` varchar(10) NOT NULL,
    CONSTRAINT `FK_Utente_L` FOREIGN KEY (`Username`) REFERENCES `Utente`(`Username`)
    on update cascade
    on delete no action,
    CONSTRAINT `FK_Post_L` FOREIGN KEY (`Id_Post`) REFERENCES `Post`(`Id_Post`)
    on update cascade
    on delete no action
)ENGINE=InnoDB;

CREATE TABLE `Commenti` (
    `Id_Commento` varchar(10) NOT NULL PRIMARY KEY,
    `Descrizione_Commento` VARCHAR(100) NOT NULL,
    `Username` varchar(10) NOT NULL,
    `Id_Post` varchar(10) NOT NULL,
    CONSTRAINT `FK_Utente_C` FOREIGN KEY (`Username`) REFERENCES `Utente`(`Username`)
    on update cascade
    on delete no action,
    CONSTRAINT `FK_Post_C` FOREIGN KEY (`Id_Post`) REFERENCES `Post`(`Id_Post`)
    on update cascade
    on delete no action
)ENGINE=InnoDB;


-- INSERT INTO `Utente` (`Username`, `Email`, `Password`, `Nome`, `Cognome`, `DataNascita`, `Genere`, `Tipo_Utente`, `Immagine_Profilo`, `Telefono`) VALUES
-- ('JeffB', 'jeffbezos@gmail.com', 'Jeffbezos64', 'Jeff', 'Bezos', '1964-01-12', 'M', 'Guest', 'https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjNy7KHkqTfAhXDzYUKHUqoAjgQjRx6BAgBEAU&url=https%3A%2F%2Fwww.biography.com%2Fpeople%2Fjeffrey-bezos%2F&psig=AOvVaw0X_Z_7Z_XZ_XZ_QZ_XZ_X&ust=1589749098679902','3245678901'),
-- ('ElonM','elonmusk@gmail.com','Elonmusk71','Elon','Musk', '1971-06-28', 'M', 'Guest', 'https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjNy7KHkqTfAhXDzYUKHUqoAjgQjRx6BAgBEAU&url=https%3A%2F%2Fwww.biography.com%2Fpeople%2Felon-musk%2F&psig=AOvVaw0X_Z_7Z_XZ_XZ_QZ_XZ_X&ust=1589749098679902','3893425674'),
-- ('BillG','billgates@gmail.com','Billgates55','Bill','Gates', '1955-10-28', 'M', 'Guest', 'https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjNy7KHkqTfAhXDzYUKHUqoAjgQjRx6BAgBEAU&url=https%3A%2F%2Fwww.biography.com%2Fpeople%2Fbill-gates%2F&psig=AOvVaw0X_Z_7Z_XZ_XZ_QZ_XZ_X&ust=1589749098679902','3541789012');

-- INSERT INTO `Follower` (`Id_Follower`, `Data_Follow`, `Username`) VALUES
-- ('F01', '2022-04-10', 'ElonM'),
-- ('F02', '2019-12-12', 'BillG');

-- INSERT INTO `Post` (`Id_Post`, `Data_Post`, `Username`, `Foto_Post`, `Descrizione`) VALUES
-- ('P01', '2019-12-12', 'ElonM', 'https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjNy7KHkqTfAhXDzYUKHUqoAjgQjRx6BAgBEAU&url=https%3A%2F%2Fwww.biography.com%2Fpeople%2Felon-musk%2F&psig=AOvVaw0X_Z_7Z_XZ_XZ_QZ_XZ_X&ust=1589749098679902','Ciao'),
-- ('P02', '2019-12-12', 'BillG', 'https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjNy7KHkqTfAhXDzYUKHUqoAjgQjRx6BAgBEAU&url=https%3A%2F%2Fwww.biography.com%2Fpeople%2Fbill-gates%2F&psig=AOvVaw0X_Z_7Z_XZ_XZ_QZ_XZ_','Siumm'),
-- ('P03','2022-04-10','JeffB','https://www.google.com/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjNy7KHkqTfAhXDzYUKHUqoAjgQjRx6BAgBEAU&url=https%3A%2F%2Fwww.biography.com%2Fpeople%2Fjeffrey-bezos%2F&psig=AOvVaw0X_Z_7Z_XZ_XZ_QZ_XZ_X&ust=1589749098679902','Iscriviti ad Amazon Prime');

-- INSERT INTO `Like` (`Id_Like`, `Username`, `Id_Post`) VALUES
-- ('L01', 'ElonM', 'P02'),
-- ('L02', 'BillG', 'P03'),
-- ('L03', 'JeffB', 'P01');

-- INSERT INTO `Commenti` (`Id_Commento`, `Descrizione_Commento`, `Username`, `Id_Post`) VALUES
-- ('C01', 'Bella', 'ElonM', 'P02'),
-- ('C02', 'GOAT', 'BillG', 'P03'),
-- ('C03', 'Alien', 'JeffB', 'P01');


-- SELECT * FROM Utente,Post,Follower WHERE Data_Post <= CAST(GETDATE()) AND Data_Post >= DATEADD(month,-2,CAST(GETDATE()))


-- SELECT `Email` FROM `Utente` WHERE `Email`='billgates@gmail.com';
-- SELECT `Telefono` FROM `Utente` WHERE `Telefono`='3541789012';