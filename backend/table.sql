create table user(
    id int primery key AUTOINCREMENT,
    name varchar(20),
    contactNumber varchar(20),
    email varchar(50),
    password varchar(50),
    status varchar(20),
    role varchar(20), 
    UNIQUE(email)
)

insert into user(name, contactNumber, email, password, status, role) values('Admin','1231231231','admin@gmail.com','admin', 'true','admin')



create table catagory(
    id int NOT NULL AUTO_INCREMET,
    name varchar(255) NOT NULL,
    primary key (id)
);


create table product(
    id int NOT NULL AUTO_INCREMET,
    name varchar(255) NOT NULL,
    categorId int NOT NULL,
    desciption varchar(255),
    price int,
    status varchar(20),
    primary key (id)
);


create table bill(
    id int NOT NULL AUTO_INCREMENT,
    uuid varchar(255) NOT NULL,
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    contactNumber varchar(20) NOT NULL,
    paymentMethod varchar(50) NOT NULL,
    total int NOT NULL,
    productDetails JSON DEFAULT NULL,
    createdBy varchar(255) NOT NULL,
    primary key (id)
);