/*
Navicat MySQL Data Transfer

Source Server         : eoulu
Source Server Version : 50721
Source Host           : localhost:3306
Source Database       : futured_v2

Target Server Type    : MYSQL
Target Server Version : 50721
File Encoding         : 65001

Date: 2018-12-19 18:23:47
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for dm_marker_data
-- ----------------------------
DROP TABLE IF EXISTS `dm_marker_data`;
CREATE TABLE `dm_marker_data` (
  `marker_id` int(255) NOT NULL AUTO_INCREMENT COMMENT 'marker',
  `wafer_id` int(255) NOT NULL COMMENT '晶圆',
  `curve_type_id` int(255) DEFAULT NULL,
  `module` char(100) NOT NULL,
  `marker_name` char(100) NOT NULL COMMENT 'marker名',
  `point_x` char(100) NOT NULL COMMENT 'X值，可能出现NaN的情况',
  `point_y` char(100) NOT NULL COMMENT 'Y值，可能出现NaN的情况',
  `location_key` char(10) DEFAULT NULL COMMENT '定位marker的标准',
  `s_parameter` varchar(255) DEFAULT NULL COMMENT 's参数',
  PRIMARY KEY (`marker_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dm_marker_data
-- ----------------------------
SET FOREIGN_KEY_CHECKS=1;
