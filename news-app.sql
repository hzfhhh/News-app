/*
SQLyog 企业版 - MySQL GUI v8.14 
MySQL - 5.7.10-log : Database - news-app
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`news-app` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `news-app`;

/*Table structure for table `chatmsg` */

DROP TABLE IF EXISTS `chatmsg`;

CREATE TABLE `chatmsg` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT 'å‘é€æ—¶é—´',
  `sendid` int(10) NOT NULL COMMENT 'å‘é€æ¶ˆæ¯çš„ç”¨æˆ·',
  `msg` text COMMENT 'æ¶ˆæ¯',
  `recid` int(10) NOT NULL COMMENT 'æŽ¥å—æ¶ˆæ¯çš„ç”¨æˆ·',
  `stime` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8;

/*Data for the table `chatmsg` */

/*Table structure for table `comment` */

DROP TABLE IF EXISTS `comment`;

CREATE TABLE `comment` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `pblid` int(10) NOT NULL COMMENT 'publishMsgè¡¨çš„idå­—æ®µ',
  `userid` int(10) NOT NULL COMMENT 'è¯„è®ºè€…id',
  `content` text NOT NULL COMMENT 'è¯„è®ºçš„å†…å®¹',
  `comTime` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP COMMENT 'è¯„è®ºçš„æ—¶é—´',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Data for the table `comment` */

insert  into `comment`(`id`,`pblid`,`userid`,`content`,`comTime`) values (1,5,1,'hi','2016-03-16 15:35:10'),(2,5,1,'ä½ å¥½','2016-03-16 17:01:01'),(3,5,1,'å“ˆå“ˆ','2016-03-22 21:32:04');

/*Table structure for table `friendlist` */

DROP TABLE IF EXISTS `friendlist`;

CREATE TABLE `friendlist` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` int(10) NOT NULL COMMENT '用户id',
  `fid` int(10) NOT NULL COMMENT '好友id',
  `valid` tinyint(4) NOT NULL COMMENT '“1”表示为好友关系，“0”表示非好友',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

/*Data for the table `friendlist` */

insert  into `friendlist`(`id`,`uid`,`fid`,`valid`) values (1,1,2,1),(2,1,3,1),(3,4,1,1),(5,2,4,1);

/*Table structure for table `publishmsg` */

DROP TABLE IF EXISTS `publishmsg`;

CREATE TABLE `publishmsg` (
  `id` int(10) NOT NULL AUTO_INCREMENT COMMENT '发布内容id',
  `userid` int(10) NOT NULL COMMENT '用户id',
  `name` text COMMENT '呢称',
  `avatar` text COMMENT '头像',
  `msg` text COMMENT '文字信息',
  `img` text COMMENT '图片信息',
  `count` int(10) DEFAULT NULL COMMENT '评论数',
  `sendTime` varchar(200) DEFAULT NULL COMMENT '发布时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

/*Data for the table `publishmsg` */

insert  into `publishmsg`(`id`,`userid`,`name`,`avatar`,`msg`,`img`,`count`,`sendTime`) values (2,1,'Ben Sparrow','img/ben.png','ä»Šå¤©å¤©æ°”ä¸é”™\r\n','img/5.png,img/6.png',0,'2016-03-12 21:01:57'),(3,2,'Max Lynx','img/max.png','é£Žæ™¯çœŸç¾Ž','img/1.png,img/2.png',0,'2016-03-12 21:51:14'),(4,1,'Ben Sparrow','img/ben.png','å—¯ï¼Œä¸é”™','img/3.png,img/6.png',0,'2016-03-12 21:50:07'),(5,1,'Ben Sparrow','img/ben.png','hi','',3,'2016-03-16 10:01:23'),(6,2,'Ben Sparrow','img/ben.png','test','img/imgPublish/14121Q02607-1.jpg,',0,'2016-03-18 12:29:47'),(7,2,'Max Lynx','img/max.png','test','',0,'2016-03-18 12:38:30'),(8,1,'Ben Sparrow','img/ben.png','hello','',0,'2016-03-22 21:29:34'),(9,1,'Ben Sparrow','img/ben.png','xxx','',0,'2016-03-22 23:13:17');

/*Table structure for table `user` */

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `account` varchar(200) DEFAULT NULL COMMENT '账号',
  `pswd` varchar(200) DEFAULT NULL COMMENT '密码',
  `name` varchar(200) DEFAULT NULL COMMENT '呢称',
  `avatar` text COMMENT '头像',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

/*Data for the table `user` */

insert  into `user`(`id`,`account`,`pswd`,`name`,`avatar`) values (1,'001','123456','Ben Sparrow','img/ben.png'),(2,'002','123456','Max Lynx','img/max.png'),(3,'003','123456','Hzf','img/default-user.png'),(4,'004','123456','Perry','img/default-user.png');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
