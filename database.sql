--DATABASE 
DROP DATABASE QLBANSACH;

CREATE DATABASE QLBANSACH;

USE QLBANSACH;

CREATE TABLE ROLE 
(
    ID INT AUTO_INCREMENT,
    ROLE_NAME VARCHAR(50),
    PRIMARY KEY (ID) 
);

CREATE TABLE USER
(
    USER_NAME VARCHAR(30),
    PASSWORD VARCHAR(300),
    ROLE_ID INT,
    VERIFY BOOLEAN,
    PRIMARY KEY (USER_NAME)
);

CREATE TABLE USER_INFOR
(
    ID INT AUTO_INCREMENT,
    USER_NAME VARCHAR(30),
    FULLNAME NVARCHAR(70),
    BIRTHDAY DATETIME,
    PHONE_NUMBER VARCHAR(10),
    MAIL VARCHAR(50),
    ADDRESS NVARCHAR(100),
    CREATE_DATE DATETIME,
    UPDATE_DATE DATETIME,
    UPDATE_INFOR BOOLEAN,
    PRIMARY KEY(ID)
);

CREATE TABLE CATEGORY
(
    ID INT AUTO_INCREMENT,
    CATEGORY_NAME NVARCHAR(30),
    PRIMARY KEY (ID)
);

CREATE TABLE AUTHOR
(
    ID INT AUTO_INCREMENT,
    AUTHOR_NAME NVARCHAR(50),
    PRIMARY KEY (ID)
);

CREATE TABLE PRODUCT
(
    ID VARCHAR(5),
    PRODUCT_NAME NVARCHAR(100),
    AUTHOR_ID INT,
    PRICE VARCHAR(20),
    CATEGORY_ID INT,
    QUANTITY INT,
    PUBLISHED_DATE DATETIME,
    DESCRIPTION TEXT,
    IMAGE_URL TEXT,
    PRIMARY KEY (ID)
);

CREATE TABLE CART
(
    ID INT AUTO_INCREMENT,
    USER_NAME VARCHAR(30),
    TOTAL_MONEY INT,
    STATE BOOLEAN,
    PRIMARY KEY (ID)
);

CREATE TABLE CART_DETAIL 
(
    CART_ID INT,
    NO_CART INT,
    PRODUCT_ID VARCHAR(5),
    NUMBER INT,
    PRICE INT,
    PRIMARY KEY (CART_ID, NO_CART)
);

--- ràng buộc
USE QLBANSACH;

ALTER TABLE USER
ADD 
(
    CONSTRAINT FK_USER_ROLE
    FOREIGN KEY (ROLE_ID)
    REFERENCES ROLE(ID)
);

ALTER TABLE USER_INFOR
ADD 
(   
    CONSTRAINT FK_USERNAME_USERNAME
    FOREIGN KEY (USER_NAME)
    REFERENCES USER(USER_NAME)
);

ALTER TABLE CART
ADD
(
    CONSTRAINT FK_CARTUSERNAME_USERNAME
    FOREIGN KEY (USER_NAME)
    REFERENCES USER(USER_NAME)
);

ALTER TABLE CART_DETAIL
ADD
(
    CONSTRAINT FK_ID_CART_ID
    FOREIGN KEY (CART_ID)
    REFERENCES CART(ID),

    CONSTRAINT FK_PRODUCT_ID_ID
    FOREIGN KEY (PRODUCT_ID)
    REFERENCES PRODUCT(ID)
);

ALTER TABLE PRODUCT
ADD
(
    CONSTRAINT FK_CATEGORY_ID_ID
    FOREIGN KEY (CATEGORY_ID)
    REFERENCES CATEGORY(ID)
);

ALTER TABLE PRODUCT
ADD
(
    CONSTRAINT FK_AUTHOR_ID_ID
    FOREIGN KEY (AUTHOR_ID)
    REFERENCES AUTHOR(ID)
);

--- Data mặc định 
INSERT INTO ROLE(ROLE_NAME)
VALUES 
    ('ADMIN'),
    ('USER');


INSERT INTO USER 
VALUES 
    ('ADMIN1', '$2b$10$mFRh.1FXkR5AcBs99u16huk.T1s7RQgJd.QcbBuxM5xxWHbu0n/Gy', '1', TRUE);

INSERT INTO USER_INFOR (USER_NAME)
VALUES
    ('ADMIN1');

---  Stored Procedure

-- TẠO TÀI KHOẢN

CREATE PROCEDURE CREATE_USER(IN p_USERNAME NVARCHAR(20), IN p_PASSWORD VARCHAR(300), IN p_MAIL VARCHAR(50), OUT p_Message NVARCHAR(255))
BEGIN 
    DECLARE v_Id INT;
    
    IF (FIND_USER(p_USERNAME) IS NOT NULL) THEN
        SET p_Message = 'ĐÃ TỒN TẠI USER';
    ELSE
        INSERT INTO USER (USER_NAME, PASSWORD, ROLE_ID, VERIFY)
        VALUES (p_USERNAME, p_PASSWORD, 2, FALSE);
        
        INSERT INTO USER_INFOR (USER_NAME, MAIL, CREATE_DATE, UPDATE_DATE, UPDATE_INFOR) 
        VALUES (p_USERNAME, p_MAIL, NOW(), NOW(), FALSE);

        INSERT INTO CART(USER_NAME,TOTAL_MONEY, STATE)
        VALUES (p_USERNAME, 0, FALSE);
        
        SET p_Message = 'TẠO TÀI KHOẢNG THÀNH CÔNG';
    END IF;
    
END;


-- UPDATE THÔNG TIN 
CREATE PROCEDURE UPDATE_INFOR(IN p_USERNAME NVARCHAR(30), IN p_FULLNAME NVARCHAR(70), IN p_BIRTHDAY DATETIME, IN p_PHONE_NUMBER VARCHAR(10), IN p_ADDRESS NVARCHAR(100), OUT p_Message VARCHAR(100))
BEGIN
    IF (FIND_USER(p_USERNAME) IS NULL) THEN
        SET p_Message = 'LỖI TRUY CẬP';
    ELSE
        UPDATE USER_INFOR
        SET
            USER_INFOR.FULLNAME = p_FULLNAME,
            USER_INFOR.BIRTHDAY = p_BIRTHDAY,
            USER_INFOR.PHONE_NUMBER = p_PHONE_NUMBER,
            USER_INFOR.BIRTHDAY = p_BIRTHDAY,
            USER_INFOR.ADDRESS = p_ADDRESS,
            USER_INFOR.UPDATE_DATE = NOW(),
            USER_INFOR.UPDATE_INFOR=TRUE
        WHERE USER_INFOR.USER_NAME = p_USERNAME;

        SET p_Message = 'CẬP NHẬT THÀNH CÔNG';
    END IF;
END;


-- XÁC THỰC TÀI KHOẢN
CREATE PROCEDURE VERIFY_USER(IN p_USERNAME NVARCHAR(30), OUT p_Message NVARCHAR(100))
BEGIN
    IF (FIND_USER(p_USERNAME) IS NULL) THEN
        SET p_Message = 'LỖI TRUY CẬP';
    ELSE
        UPDATE USER
        SET
            USER.VERIFY=TRUE
        WHERE USER.USER_NAME = p_USERNAME;

        SET p_Message = 'XÁC THỰC THÀNH CÔNG';
    END IF;
END;


-- THÊM SẢN PHẨM (ADMIN)
CREATE PROCEDURE ADD_NEW_PRODUCT(IN p_PRODUCT_ID VARCHAR(5), IN p_PRODUCT_NAME NVARCHAR(100), IN p_PRICE VARCHAR(20) ,IN p_AUTHOR NVARCHAR(50),  IN p_CATEGORY NVARCHAR(30), IN p_QUANTITY INT, IN p_PUBLISHED_DATE DATETIME, IN p_DESCRIBE TEXT, p_IMGE_URL TEXT, OUT p_Message NVARCHAR(100))
BEGIN
    DECLARE id_category INT;
    DECLARE id_author INT;
    IF ((SELECT ID FROM PRODUCT WHERE ID = p_PRODUCT_ID) IS NOT NULL) THEN
        SET p_Message = 'SẢN PHẨM ĐÃ TỒN TẠI';
    ELSE
        IF NOT EXISTS(SELECT * FROM AUTHOR WHERE AUTHOR_NAME = p_AUTHOR)  THEN
            INSERT INTO AUTHOR(AUTHOR_NAME) 
            VALUES (p_AUTHOR);
        END IF;
        IF NOT EXISTS (SELECT * FROM CATEGORY WHERE CATEGORY_NAME = p_CATEGORY) THEN
            INSERT INTO CATEGORY(CATEGORY_NAME) VALUES (p_CATEGORY);
        END IF;

        SET id_category = (SELECT ID FROM CATEGORY WHERE CATEGORY_NAME = p_CATEGORY);
        SET id_author = (SELECT ID FROM AUTHOR WHERE AUTHOR_NAME = p_AUTHOR);

        INSERT INTO PRODUCT
        VALUES (p_PRODUCT_ID, p_PRODUCT_NAME, id_author, p_PRICE ,id_category, p_QUANTITY, p_PUBLISHED_DATE, p_DESCRIBE, p_IMGE_URL);
        SET p_Message = 'ĐÃ THÊM SẢN PHẨM';
    END IF;
END;

--Lấy các sản phẩm 
CREATE PROCEDURE GET_ALL_PRODUCT()
BEGIN

    SELECT  P.ID, P.PRODUCT_NAME, P.PRICE , AU.AUTHOR_NAME, CG.CATEGORY_NAME, P.DESCRIPTION, P.PUBLISHED_DATE, P.IMAGE_URL, P.QUANTITY 
    FROM PRODUCT P
    JOIN AUTHOR AU ON AU.ID = P.AUTHOR_ID
    JOIN CATEGORY CG ON CG.ID = P.CATEGORY_ID;
END;



CREATE PROCEDURE GET_PRODUCT(IN p_PRODUCT_ID INT)
BEGIN

    SELECT  P.ID, P.PRODUCT_NAME, P.PRICE , AU.AUTHOR_NAME, CG.CATEGORY_NAME, P.DESCRIPTION, P.PUBLISHED_DATE, P.IMAGE_URL, P.QUANTITY 
    FROM PRODUCT P
    JOIN AUTHOR AU ON AU.ID = P.AUTHOR_ID
    JOIN CATEGORY CG ON CG.ID = P.CATEGORY_ID
    WHERE P.ID = p_PRODUCT_ID;
END;

---Lấy sản phẩm giỏ hàng
CREATE PROCEDURE GET_CART(IN p_USER_NAME VARCHAR(30))
BEGIN
    SELECT *
    FROM CART C
    JOIN CART_DETAIL CD ON CD.CART_ID =  C.ID
    WHERE C.USER_NAME = CD

END;



-- Thêm sản phẩm vào giảo hàng

CREATE PROCEDURE ADD_CART(IN p_PRODUCT_ID VARCHAR(5), IN p_USERNAME VARCHAR(30), OUT p_Message NVARCHAR(100))
BEGIN
    DECLARE cart_id INT;
    DECLARE no_cart INT;
    DECLARE p_price INT;
    DECLARE num INT;

    IF ( FIND_USER(p_USERNAME) IS NULL) THEN
        SET p_Message = 'LỖI TRUY CẬP';
    ELSEIF(NOT EXISTS (SELECT PRODUCT_NAME FROM PRODUCT WHERE ID = p_PRODUCT_ID)) THEN
        SET p_Message = 'LỖI TRUY CẬP';
    ELSE
        SET num=0;
        SET cart_id = (SELECT ID FROM CART WHERE USER_NAME = p_USERNAME);
        SET no_cart = (SELECT COUNT(*) + 1 FROM CART_DETAIL WHERE CART_ID = cart_id );
        SET p_price = (SELECT PRICE FROM PRODUCT WHERE ID = p_PRODUCT_ID);
        IF (EXISTS (SELECT NO_CART FROM CART_DETAIL WHERE CART_ID = cart_id AND PRODUCT_ID = p_PRODUCT_ID)) THEN
            SET num = (SELECT NUMBER FROM CART_DETAIL WHERE CART_ID = cart_id AND PRODUCT_ID = p_PRODUCT_ID) +1 ;
            SET p_price = p_price * num;
            UPDATE CART_DETAIL
            SET 
                CART_DETAIL.PRICE = p_price,
                CART_DETAIL.NUMBER = num
            WHERE CART_DETAIL.CART_ID = cart_id AND CART_DETAIL.PRODUCT_ID = p_PRODUCT_ID;
        ELSE
            SET num = 1;
            INSERT INTO CART_DETAIL (CART_ID, NO_CART, NUMBER, PRICE, PRODUCT_ID)
            VALUES (cart_id, no_cart, num, p_price, p_PRODUCT_ID);
        END IF;

        SET p_Message = 'Đã thêm sản phẩm vào giỏ hàng';
    END IF;
END;

DROP PROCEDURE ADD_CART

CALL ADD_CART ('bk102', 'minhquang', @p_mes); SELECT @p_mes;






--CALL CREATE_USER('Minh Quang', '12344', 'huynhminhquang2803@gmail.com', @p_mes) ; SELECT @p_mes;

--CALL UPDATE_INFOR('Minh Quang', 'Huỳnh Minh Quang', '2003/03/28', '', 'Quận 7, Tp.HCMM', @p_mes); SELECT @p_mes;



--- 


CREATE FUNCTION FIND_USER(Username VARCHAR(30))
RETURNS VARCHAR(30)
DETERMINISTIC
NO SQL
BEGIN 
    DECLARE result VARCHAR(30);
    SET result =  (SELECT USERNAME 
    FROM USER
    WHERE USER.USER_NAME = Username);
    RETURN result;
END;

CREATE FUNCTION FIND_PASSWORD(Username VARCHAR(30))
RETURNS VARCHAR(300)
DETERMINISTIC
NO SQL
BEGIN 
    DECLARE result VARCHAR(300);
    SET result =  (SELECT PASSWORD 
    FROM USER
    WHERE USER.USER_NAME = Username);
    RETURN result;
END;


CREATE FUNCTION FIND_ROLE(Username VARCHAR(30))
RETURNS VARCHAR(30)
DETERMINISTIC
NO SQL
BEGIN 
    DECLARE result VARCHAR(30);
    SET result =  (SELECT ROLE.ROLE_NAME 
    FROM ROLE 
    JOIN USER ON USER.ROLE_ID = ROLE.ID
    WHERE USER.USER_NAME = Username);
    RETURN result;
END;





