DROP DATABASE IF EXISTS `fake_test`;
CREATE DATABASE `fake_test`;

USE fake_test;

DROP TABLE IF EXISTS `sinh_vien`;
CREATE TABLE `sinh_vien` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ma_sv` varchar(255) NOT NULL,
  `ma_lop` varchar(255) NOT NULL,
  `ten_sv` varchar(255) NOT NULL,
  `ngay_sinh` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `lop`;
CREATE TABLE `lop` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ma_lop` varchar(255) NOT NULL,
  `ten_lop` varchar(255) NOT NULL,
  `ma_phong_hoc` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `phong_hoc`;
CREATE TABLE `phong_hoc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `ma_phong_hoc` varchar(255) NOT NULL,
  `ten_phong_hoc` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO `phong_hoc` (`ma_phong_hoc`, `ten_phong_hoc`) VALUES ("PH-85423", "1B");
INSERT INTO `lop` (`ma_lop`, `ten_lop`, `ma_phong_hoc`) VALUES ("LP-7745", "HC-8", "PH-85423");
INSERT INTO `sinh_vien` (`ma_sv`, `ma_lop`, `ten_sv`, `ngay_sinh`) VALUES ("SV-4785", "LP-7745", "Huu Ha", "2000-12-26");
