/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50027
Source Host           : localhost:3306
Source Database       : futured_v2

Target Server Type    : MYSQL
Target Server Version : 50027
File Encoding         : 65001

Date: 2018-12-10 16:45:57
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for `dm_authority`
-- ----------------------------
DROP TABLE IF EXISTS `dm_authority`;
CREATE TABLE `dm_authority` (
  `authority_id` int(10) NOT NULL auto_increment COMMENT '主键',
  `authority_name` char(100) NOT NULL COMMENT '权限名',
  `authority_url` char(100) NOT NULL,
  `page` char(100) character set utf8 collate utf8_unicode_ci NOT NULL default '页面',
  `hidden` int(10) NOT NULL,
  PRIMARY KEY  (`authority_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dm_authority
-- ----------------------------
INSERT INTO `dm_authority` VALUES ('7', '数据列表', 'DataList', '数据列表', '0');
INSERT INTO `dm_authority` VALUES ('8', '上传', 'UploadStorage', '数据列表', '0');
INSERT INTO `dm_authority` VALUES ('9', '修改', 'DataListUpdate', '数据列表', '0');
INSERT INTO `dm_authority` VALUES ('10', '删除', 'DataListRemove', '数据列表', '0');
INSERT INTO `dm_authority` VALUES ('11', '详细数据', 'WaferData', '详细数据', '0');
INSERT INTO `dm_authority` VALUES ('12', '回收站', 'RecycleBin', '回收站', '0');
INSERT INTO `dm_authority` VALUES ('13', '工程分析', 'ProjectAnalysis', '工程分析', '0');
INSERT INTO `dm_authority` VALUES ('14', '数据对比', 'DataCompare', '数据对比', '0');
INSERT INTO `dm_authority` VALUES ('15', 'RF-S2P分析', 'Analysis', '工程分析', '0');
INSERT INTO `dm_authority` VALUES ('16', '数据分析', 'DataStatistics', '工程分析', '0');
INSERT INTO `dm_authority` VALUES ('17', '管理员', 'UserInstall', '管理员', '0');
INSERT INTO `dm_authority` VALUES ('18', '上传文件', 'UploadFile', '数据列表', '1');
INSERT INTO `dm_authority` VALUES ('19', '上传进度', 'LoadProgress', '数据列表', '1');
INSERT INTO `dm_authority` VALUES ('20', '删除', 'RecycleBinRemove', '回收站', '0');
INSERT INTO `dm_authority` VALUES ('21', '恢复', 'RecycleBinRecovery', '回收站', '0');
INSERT INTO `dm_authority` VALUES ('22', '导出', 'ExportWafer', '详细数据', '0');
INSERT INTO `dm_authority` VALUES ('23', '矢量数据', 'VectorMap', '详细数据', '0');
INSERT INTO `dm_authority` VALUES ('24', '矢量数据过滤', 'VectorMapFilter', '详细数据', '1');
INSERT INTO `dm_authority` VALUES ('25', '矢量数据曲线', 'VectorCurve', '详细数据', '1');
INSERT INTO `dm_authority` VALUES ('26', 'Smith曲线切换', 'AnalysisCurve', '详细数据', '1');
INSERT INTO `dm_authority` VALUES ('27', '参数分布', 'WaferMap', '详细数据', '0');
INSERT INTO `dm_authority` VALUES ('28', '色阶晶圆', 'ColorMap', '详细数据', '1');
INSERT INTO `dm_authority` VALUES ('29', '良品率', 'ShowYield', '详细数据', '1');
INSERT INTO `dm_authority` VALUES ('30', '直方图', 'Histogram', '详细数据', '1');
INSERT INTO `dm_authority` VALUES ('31', '箱线图', 'Boxplot', '详细数据', '1');
INSERT INTO `dm_authority` VALUES ('32', 'CPK图', 'CPKServlet', '详细数据', '1');
INSERT INTO `dm_authority` VALUES ('33', '高斯分布', 'GaussianDistribution', '详细数据', '1');
INSERT INTO `dm_authority` VALUES ('34', '用户操作', 'UserOperate', '管理员', '1');
INSERT INTO `dm_authority` VALUES ('35', '用户删除', 'UserRemove', '管理员', '1');
INSERT INTO `dm_authority` VALUES ('36', '成员管理', 'UserManager', '管理员', '1');
INSERT INTO `dm_authority` VALUES ('37', '密码修改', 'UserModifyPassword', '管理员', '1');
INSERT INTO `dm_authority` VALUES ('38', '权限修改', 'AuthorityModify', '管理员', '1');
INSERT INTO `dm_authority` VALUES ('39', '权限展示', 'Authority', '管理员', '1');
INSERT INTO `dm_authority` VALUES ('40', '操作日志', 'LogInfo', '管理员', '1');
INSERT INTO `dm_authority` VALUES ('41', '日志导出', 'LogExport', '管理员', '1');
INSERT INTO `dm_authority` VALUES ('42', '共有参数', 'ParameterRange', '数据对比', '1');
INSERT INTO `dm_authority` VALUES ('43', '晶圆数据', 'DataListAjax', '数据对比', '1');
INSERT INTO `dm_authority` VALUES ('44', '良率晶圆', 'WaferMap', '数据对比', '0');
INSERT INTO `dm_authority` VALUES ('45', '色阶晶圆', 'ColorMap', '数据对比', '0');
INSERT INTO `dm_authority` VALUES ('46', '良品率', 'ShowYield', '数据对比', '0');
INSERT INTO `dm_authority` VALUES ('47', '直方图', 'Histogram', '数据对比', '0');
INSERT INTO `dm_authority` VALUES ('48', '箱线图', 'Boxplot', '数据对比', '0');
INSERT INTO `dm_authority` VALUES ('49', 'CPK图', 'CPKServlet', '数据对比', '0');
INSERT INTO `dm_authority` VALUES ('50', '相关性', 'Correlation', '数据对比', '0');
INSERT INTO `dm_authority` VALUES ('51', '用户查重', 'UserNameQuery', '管理员', '1');
INSERT INTO `dm_authority` VALUES ('52', '检验是否能够绘图', 'Examine', '数据列表', '1');

-- ----------------------------
-- Table structure for `dm_curve_data`
-- ----------------------------
DROP TABLE IF EXISTS `dm_curve_data`;
CREATE TABLE `dm_curve_data` (
  `curve_data_id` int(255) NOT NULL auto_increment COMMENT '主键',
  `wafer_id` int(255) NOT NULL COMMENT '晶圆',
  `curve_type_id` int(255) NOT NULL COMMENT '曲线类型主键',
  `C1` double default NULL,
  `C2` double default NULL,
  `C3` double default NULL,
  `C4` double default NULL,
  `C5` double default NULL,
  `C6` double default NULL,
  `C7` double default NULL,
  `C8` double default NULL,
  `C9` double default NULL,
  `C10` double default NULL,
  `C11` double default NULL,
  `C12` double default NULL,
  `C13` double default NULL,
  `C14` double default NULL,
  `C15` double default NULL,
  `C16` double default NULL,
  `C17` double default NULL,
  `C18` double default NULL,
  `C19` double default NULL,
  `C20` double default NULL,
  `C21` double default NULL,
  `C22` double default NULL,
  `C23` double default NULL,
  `C24` double default NULL,
  `C25` double default NULL,
  `C26` double default NULL,
  `C27` double default NULL,
  `C28` double default NULL,
  `C29` double default NULL,
  `C30` double default NULL,
  `C31` double default NULL,
  `C32` double default NULL,
  `C33` double default NULL,
  `C34` double default NULL,
  `C35` double default NULL,
  `C36` double default NULL,
  `C37` double default NULL,
  `C38` double default NULL,
  `C39` double default NULL,
  `C40` double default NULL,
  `C41` double default NULL,
  `C42` double default NULL,
  `C43` double default NULL,
  `C44` double default NULL,
  `C45` double default NULL,
  `C46` double default NULL,
  `C47` double default NULL,
  `C48` double default NULL,
  `C49` double default NULL,
  `C50` double default NULL,
  `C51` double default NULL,
  `C52` double default NULL,
  `C53` double default NULL,
  `C54` double default NULL,
  `C55` double default NULL,
  `C56` double default NULL,
  `C57` double default NULL,
  `C58` double default NULL,
  `C59` double default NULL,
  `C60` double default NULL,
  PRIMARY KEY  (`curve_data_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dm_curve_data
-- ----------------------------

-- ----------------------------
-- Table structure for `dm_curve_parameter`
-- ----------------------------
DROP TABLE IF EXISTS `dm_curve_parameter`;
CREATE TABLE `dm_curve_parameter` (
  `curve_parameter_id` int(255) NOT NULL auto_increment COMMENT '主键',
  `wafer_id` int(255) NOT NULL COMMENT '晶圆',
  `curve_type_id` int(255) NOT NULL COMMENT '曲线类型',
  `curve_parameter` char(100) NOT NULL COMMENT '曲线参数名',
  `curve_unit` char(100) default NULL COMMENT '曲线参数单位',
  `curve_column` char(100) NOT NULL COMMENT '曲线参数对应字段',
  PRIMARY KEY  (`curve_parameter_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dm_curve_parameter
-- ----------------------------

-- ----------------------------
-- Table structure for `dm_curve_type`
-- ----------------------------
DROP TABLE IF EXISTS `dm_curve_type`;
CREATE TABLE `dm_curve_type` (
  `curve_type_id` int(255) NOT NULL auto_increment COMMENT '主键',
  `wafer_id` int(255) NOT NULL COMMENT '晶圆',
  `coordinate_id` int(255) NOT NULL COMMENT 'die',
  `subdie_id` int(255) NOT NULL COMMENT 'subdie',
  `curve_type` char(100) NOT NULL COMMENT '曲线类型',
  `device_group` char(100) NOT NULL,
  `curve_file_name` char(100) NOT NULL COMMENT '曲线文件',
  `curve_file_type` int(10) NOT NULL COMMENT '默认0，用于区分是否是Smith数据，为1时-Smith数据',
  `temperature` char(100) default NULL COMMENT '温度',
  PRIMARY KEY  (`curve_type_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dm_curve_type
-- ----------------------------

-- ----------------------------
-- Table structure for `dm_log`
-- ----------------------------
DROP TABLE IF EXISTS `dm_log`;
CREATE TABLE `dm_log` (
  `log_id` int(10) NOT NULL auto_increment COMMENT '主键',
  `user_name` char(100) NOT NULL COMMENT '操作账户',
  `page` char(100) NOT NULL COMMENT '操作页面',
  `description` varchar(255) NOT NULL COMMENT '操作记录',
  `gmt_create` datetime default NULL COMMENT '操作时间',
  `ip_address` char(100) default NULL COMMENT 'IP地址',
  `location` char(100) default NULL COMMENT '地理位置',
  PRIMARY KEY  (`log_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dm_log
-- ----------------------------

-- ----------------------------
-- Table structure for `dm_marker_calculation`
-- ----------------------------
DROP TABLE IF EXISTS `dm_marker_calculation`;
CREATE TABLE `dm_marker_calculation` (
  `marker_id` int(255) NOT NULL auto_increment COMMENT '主键',
  `wafer_id` int(255) NOT NULL COMMENT '晶圆',
  `module` char(100) default NULL COMMENT '模块',
  `user_formula` char(100) default NULL,
  `custom_parameter` char(100) default NULL COMMENT '自定义参数',
  `calculate_formula` varchar(255) default NULL COMMENT '计算公式',
  `calculation_result` double default NULL COMMENT '计算结果',
  PRIMARY KEY  (`marker_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dm_marker_calculation
-- ----------------------------

-- ----------------------------
-- Table structure for `dm_marker_data`
-- ----------------------------
DROP TABLE IF EXISTS `dm_marker_data`;
CREATE TABLE `dm_marker_data` (
  `marker_id` int(255) NOT NULL auto_increment COMMENT 'marker',
  `wafer_id` int(255) NOT NULL COMMENT '晶圆',
  `curve_type_id` int(255) default NULL,
  `module` char(100) NOT NULL,
  `marker_name` char(100) NOT NULL COMMENT 'marker名',
  `point_x` char(100) NOT NULL COMMENT 'X值，可能出现NaN的情况',
  `point_y` char(100) NOT NULL COMMENT 'Y值，可能出现NaN的情况',
  `location_key` char(10) default NULL COMMENT '定位marker的标准',
  PRIMARY KEY  (`marker_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dm_marker_data
-- ----------------------------

-- ----------------------------
-- Table structure for `dm_role`
-- ----------------------------
DROP TABLE IF EXISTS `dm_role`;
CREATE TABLE `dm_role` (
  `role_id` int(10) NOT NULL auto_increment COMMENT '主键',
  `role_name` char(100) NOT NULL COMMENT '角色名',
  PRIMARY KEY  (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dm_role
-- ----------------------------
INSERT INTO `dm_role` VALUES ('1', '成员');
INSERT INTO `dm_role` VALUES ('2', '管理员');
INSERT INTO `dm_role` VALUES ('3', '超级管理员');

-- ----------------------------
-- Table structure for `dm_smith_data`
-- ----------------------------
DROP TABLE IF EXISTS `dm_smith_data`;
CREATE TABLE `dm_smith_data` (
  `smith_id` int(255) NOT NULL auto_increment COMMENT '主键',
  `wafer_id` int(255) NOT NULL COMMENT '晶圆',
  `curve_type_id` int(255) NOT NULL COMMENT '曲线类型',
  `frequency` double default NULL COMMENT '频率',
  `real_part_s11` double default NULL COMMENT 's11实部',
  `imaginary_part_s11` double default NULL COMMENT 's11虚部',
  `real_part_s12` double default NULL COMMENT 's12实部',
  `imaginary_part_s12` double default NULL COMMENT 's12虚部',
  `real_part_s21` double default NULL COMMENT 's21实部',
  `imaginary_part_s21` double default NULL COMMENT 's21虚部',
  `real_part_s22` double default NULL COMMENT 's22实部',
  `imaginary_part_s22` double default NULL COMMENT 's22虚部',
  PRIMARY KEY  (`smith_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dm_smith_data
-- ----------------------------

-- ----------------------------
-- Table structure for `dm_user`
-- ----------------------------
DROP TABLE IF EXISTS `dm_user`;
CREATE TABLE `dm_user` (
  `user_id` int(64) NOT NULL auto_increment COMMENT '主键',
  `user_name` varchar(255) collate utf8_bin NOT NULL COMMENT '用户名',
  `password` varchar(255) collate utf8_bin NOT NULL COMMENT '密码',
  `sex` char(20) collate utf8_bin default NULL,
  `telephone` char(100) collate utf8_bin default NULL,
  `email` char(100) collate utf8_bin default NULL,
  `role_id` int(10) default NULL COMMENT '角色',
  `authority` varchar(255) collate utf8_bin default NULL COMMENT '权限',
  `last_login` datetime default NULL COMMENT '上次登录时间',
  `gmt_create` datetime default NULL COMMENT '生成时间',
  `current_login` datetime default NULL,
  PRIMARY KEY  (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Records of dm_user
-- ----------------------------
INSERT INTO `dm_user` VALUES ('2', 'TEST', '21232f297a57a5a743894a0e4a801fc3', '男', '1235', 'test', '2', '8,9,10,43,44,45,46,47,48,49,20,21,22,23,27,15,16', '2018-10-15 11:17:59', '2018-09-27 15:24:19', '2018-10-15 11:18:39');
INSERT INTO `dm_user` VALUES ('4', 'Admin', '21232f297a57a5a743894a0e4a801fc3', '男', '18840880125', '1576664187@qq.com', '3', '7,8,9,10,11,12,13,14,15,16,17,20,21,22,23,27,44,45,46,47,48,49,50', '2018-12-07 21:42:59', '2018-10-15 11:20:31', '2018-12-07 21:49:55');
INSERT INTO `dm_user` VALUES ('5', '', '530c531995e4477795d851039169e1d2', '男', '', '', '1', '', null, '2018-11-07 09:39:06', null);
INSERT INTO `dm_user` VALUES ('43', 'Robot', '21232f297a57a5a743894a0e4a801fc3', '女', '18828934', '151515@qq.com', '1', '8,9,10', null, '2018-11-22 19:20:43', null);

-- ----------------------------
-- Table structure for `dm_wafer`
-- ----------------------------
DROP TABLE IF EXISTS `dm_wafer`;
CREATE TABLE `dm_wafer` (
  `file_last_modified` datetime NOT NULL default '0000-00-00 00:00:00',
  `wafer_id` int(255) NOT NULL auto_increment COMMENT '主键',
  `wafer_number` char(100) NOT NULL COMMENT '晶圆编号',
  `die_type` char(100) default NULL COMMENT '器件类型',
  `device_number` char(100) default NULL COMMENT '设备/产品类型',
  `lot_number` char(100) NOT NULL COMMENT '批次编号',
  `product_category` char(100) NOT NULL COMMENT '产品类别',
  `wafer_file_name` varchar(255) NOT NULL COMMENT '晶圆文件名',
  `qualified_rate` decimal(32,2) NOT NULL COMMENT '良率',
  `test_start_date` datetime NOT NULL COMMENT '测试起始时间',
  `test_end_date` datetime NOT NULL COMMENT '测试截止时间',
  `test_operator` int(10) NOT NULL COMMENT '测试员',
  `archive_user` int(10) default NULL COMMENT '上传者',
  `description` varchar(255) NOT NULL COMMENT '描述',
  `delete_status` int(10) default '0' COMMENT '删除状态,1表示在回收站中',
  `total_test_quantity` int(32) default '0' COMMENT '测试总数',
  `data_format` int(10) NOT NULL COMMENT '数据格式',
  `gmt_create` datetime NOT NULL COMMENT '生成时间',
  `gmt_modified` datetime NOT NULL COMMENT '修改时间',
  PRIMARY KEY  (`wafer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dm_wafer
-- ----------------------------

-- ----------------------------
-- Table structure for `dm_wafer_coordinate_data`
-- ----------------------------
DROP TABLE IF EXISTS `dm_wafer_coordinate_data`;
CREATE TABLE `dm_wafer_coordinate_data` (
  `coordinate_id` int(255) NOT NULL auto_increment COMMENT '主键',
  `wafer_id` int(255) NOT NULL,
  `alphabetic_coordinate` char(100) default NULL COMMENT '字母坐标',
  `x_coordinate` int(10) NOT NULL COMMENT 'die X坐标',
  `y_coordinate` int(10) NOT NULL COMMENT 'die Y坐标',
  `die_number` int(10) default NULL COMMENT 'die编号',
  `bin` int(10) default NULL COMMENT '总bin',
  `device` char(100) default NULL,
  `bin_data` int(10) default NULL COMMENT 'Excel新数据格式中需存储的',
  `test_time` int(10) default NULL COMMENT '测试时间',
  `C1` double default NULL,
  `C2` double default NULL,
  `C3` double default NULL,
  `C4` double default NULL,
  `C5` double default NULL,
  `C6` double default NULL,
  `C7` double default NULL,
  `C8` double default NULL,
  `C9` double default NULL,
  `C10` double default NULL,
  `C11` double default NULL,
  `C12` double default NULL,
  `C13` double default NULL,
  `C14` double default NULL,
  `C15` double default NULL,
  `C16` double default NULL,
  `C17` double default NULL,
  `C18` double default NULL,
  `C19` double default NULL,
  `C20` double default NULL,
  `C21` double default NULL,
  `C22` double default NULL,
  `C23` double default NULL,
  `C24` double default NULL,
  `C25` double default NULL,
  `C26` double default NULL,
  `C27` double default NULL,
  `C28` double default NULL,
  `C29` double default NULL,
  `C30` double default NULL,
  `C31` double default NULL,
  `C32` double default NULL,
  `C33` double default NULL,
  `C34` double default NULL,
  `C35` double default NULL,
  `C36` double default NULL,
  `C37` double default NULL,
  `C38` double default NULL,
  `C39` double default NULL,
  `C40` double default NULL,
  `C41` double default NULL,
  `C42` double default NULL,
  `C43` double default NULL,
  `C44` double default NULL,
  `C45` double default NULL,
  `C46` double default NULL,
  `C47` double default NULL,
  `C48` double default NULL,
  `C49` double default NULL,
  `C50` double default NULL,
  `C51` double default NULL,
  `C52` double default NULL,
  `C53` double default NULL,
  `C54` double default NULL,
  `C55` double default NULL,
  `C56` double default NULL,
  `C57` double default NULL,
  `C58` double default NULL,
  `C59` double default NULL,
  `C60` double default NULL,
  `C61` double default NULL,
  `C62` double default NULL,
  `C63` double default NULL,
  `C64` double default NULL,
  `C65` double default NULL,
  `C66` double default NULL,
  `C67` double default NULL,
  `C68` double default NULL,
  `C69` double default NULL,
  `C70` double default NULL,
  `H1` char(50) default NULL,
  `H2` char(50) default NULL,
  `H3` char(50) default NULL,
  `H4` char(50) default NULL,
  `H5` char(50) default NULL,
  `H6` char(50) default NULL,
  `H7` char(50) default NULL,
  `H8` char(50) default NULL,
  `H9` char(50) default NULL,
  `H10` char(50) default NULL,
  `H11` char(50) default NULL,
  `H12` char(50) default NULL,
  `H13` char(50) default NULL,
  `H14` char(50) default NULL,
  `H15` char(50) default NULL,
  `H16` char(50) default NULL,
  `H17` char(50) default NULL,
  `H18` char(50) default NULL,
  `H19` char(50) default NULL,
  `H20` char(50) default NULL,
  `H21` char(50) default NULL,
  `H22` char(50) default NULL,
  `H23` char(50) default NULL,
  `H24` char(50) default NULL,
  `H25` char(50) default NULL,
  `H26` char(50) default NULL,
  `H27` char(50) default NULL,
  `H28` char(50) default NULL,
  `H29` char(50) default NULL,
  `H30` char(50) default NULL,
  `H31` char(50) default NULL,
  `H32` char(50) default NULL,
  `H33` char(50) default NULL,
  `H34` char(50) default NULL,
  `H35` char(50) default NULL,
  `H36` char(50) default NULL,
  `H37` char(50) default NULL,
  `H38` char(50) default NULL,
  `H39` char(50) default NULL,
  `H40` char(50) default NULL,
  `H41` char(50) default NULL,
  `H42` char(50) default NULL,
  `H43` char(50) default NULL,
  `H44` char(50) default NULL,
  `H45` char(50) default NULL,
  `H46` char(50) default NULL,
  `H47` char(50) default NULL,
  `H48` char(50) default NULL,
  `H49` char(50) default NULL,
  `H50` char(50) default NULL,
  PRIMARY KEY  (`coordinate_id`),
  KEY `wafer_id` (`wafer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dm_wafer_coordinate_data
-- ----------------------------

-- ----------------------------
-- Table structure for `dm_wafer_map_parameter`
-- ----------------------------
DROP TABLE IF EXISTS `dm_wafer_map_parameter`;
CREATE TABLE `dm_wafer_map_parameter` (
  `map_parameter_id` int(255) NOT NULL auto_increment,
  `diameter` double NOT NULL COMMENT '直径',
  `cutting_edge_length` double NOT NULL COMMENT '切边长度',
  `die_x_max` double NOT NULL COMMENT 'die x轴最大坐标',
  `die_y_max` double NOT NULL COMMENT 'die y轴最大坐标',
  `direction_x` char(100) NOT NULL COMMENT 'map图X轴方向',
  `direction_y` char(100) NOT NULL COMMENT 'map图Y轴方向',
  `set_coor_x` char(100) default NULL COMMENT 'X增长方向',
  `set_coor_y` char(100) default NULL COMMENT 'Y增长方向',
  `set_coor_die_x` int(100) default NULL COMMENT '转换参考坐标X',
  `set_coor_die_y` int(100) default NULL COMMENT '转换参考坐标Y',
  `stand_coor_die_x` char(100) default NULL COMMENT '参考坐标X',
  `stand_coor_die_y` char(100) default NULL COMMENT '参考坐标Y',
  `wafer_number` char(100) NOT NULL,
  PRIMARY KEY  (`map_parameter_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dm_wafer_map_parameter
-- ----------------------------

-- ----------------------------
-- Table structure for `dm_wafer_parameter`
-- ----------------------------
DROP TABLE IF EXISTS `dm_wafer_parameter`;
CREATE TABLE `dm_wafer_parameter` (
  `parameter_id` int(255) NOT NULL auto_increment COMMENT '主键',
  `wafer_id` int(255) NOT NULL COMMENT '晶圆表主键',
  `parameter_name` char(100) NOT NULL COMMENT '参数名称',
  `parameter_unit` char(100) default NULL COMMENT '参数单位',
  `parameter_column` char(100) NOT NULL COMMENT '参数对应字段名',
  `upper_limit` double default NULL COMMENT '参数上限',
  `lower_limit` double default NULL COMMENT '参数下限',
  PRIMARY KEY  (`parameter_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dm_wafer_parameter
-- ----------------------------

-- ----------------------------
-- Table structure for `dm_wafer_secondary_info`
-- ----------------------------
DROP TABLE IF EXISTS `dm_wafer_secondary_info`;
CREATE TABLE `dm_wafer_secondary_info` (
  `secondary_id` int(255) NOT NULL auto_increment COMMENT '主键',
  `computer_name` char(100) default NULL COMMENT '电脑名称',
  `tester` char(100) default NULL COMMENT '测试员',
  `total_test_time` char(100) default NULL,
  `wafer_number` char(100) default NULL,
  PRIMARY KEY  (`secondary_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dm_wafer_secondary_info
-- ----------------------------

-- ----------------------------
-- Table structure for `dm_wafer_subdie`
-- ----------------------------
DROP TABLE IF EXISTS `dm_wafer_subdie`;
CREATE TABLE `dm_wafer_subdie` (
  `subdie_id` int(255) NOT NULL auto_increment COMMENT '主键',
  `coordinate_id` int(255) NOT NULL COMMENT 'die',
  `subdie_number` int(10) NOT NULL COMMENT 'subdie编号',
  `wafer_id` int(255) NOT NULL,
  `subdie_x` int(10) NOT NULL,
  `subdie_y` int(10) NOT NULL,
  `subdie_type` int(10) NOT NULL,
  `bin` int(10) NOT NULL,
  `test_time` int(10) default '0',
  `C1` double default NULL,
  `C2` double default NULL,
  `C3` double default NULL,
  `C4` double default NULL,
  `C5` double default NULL,
  `C6` double default NULL,
  `C7` double default NULL,
  `C8` double default NULL,
  `C9` double default NULL,
  `C10` double default NULL,
  `C11` double default NULL,
  `C12` double default NULL,
  `C13` double default NULL,
  `C14` double default NULL,
  `C15` double default NULL,
  `C16` double default NULL,
  `C17` double default NULL,
  `C18` double default NULL,
  `C19` double default NULL,
  `C20` double default NULL,
  `C21` double default NULL,
  `C22` double default NULL,
  `C23` double default NULL,
  `C24` double default NULL,
  `C25` double default NULL,
  `C26` double default NULL,
  `C27` double default NULL,
  `C28` double default NULL,
  `C29` double default NULL,
  `C30` double default NULL,
  `C31` double default NULL,
  `C32` double default NULL,
  `C33` double default NULL,
  `C34` double default NULL,
  `C35` double default NULL,
  `C36` double default NULL,
  `C37` double default NULL,
  `C38` double default NULL,
  `C39` double default NULL,
  `C40` double default NULL,
  `C41` double default NULL,
  `C42` double default NULL,
  `C43` double default NULL,
  `C44` double default NULL,
  `C45` double default NULL,
  `C46` double default NULL,
  `C47` double default NULL,
  `C48` double default NULL,
  `C49` double default NULL,
  `C50` double default NULL,
  PRIMARY KEY  (`subdie_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dm_wafer_subdie
-- ----------------------------

-- ----------------------------
-- Table structure for `dm_wafer_subdie_config`
-- ----------------------------
DROP TABLE IF EXISTS `dm_wafer_subdie_config`;
CREATE TABLE `dm_wafer_subdie_config` (
  `subdie_config_id` int(255) NOT NULL auto_increment,
  `subdie_number` int(10) NOT NULL,
  `offset_x` double NOT NULL,
  `offset_y` double NOT NULL,
  `subdie_size_x` double NOT NULL,
  `subdie_size_y` double NOT NULL,
  PRIMARY KEY  (`subdie_config_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dm_wafer_subdie_config
-- ----------------------------

-- ----------------------------
-- Table structure for `dm_wafer_subdie_parameter`
-- ----------------------------
DROP TABLE IF EXISTS `dm_wafer_subdie_parameter`;
CREATE TABLE `dm_wafer_subdie_parameter` (
  `subdie_parameter_id` int(255) NOT NULL auto_increment,
  `subdie_type` char(100) NOT NULL,
  `parameter_name` char(100) NOT NULL,
  `parameter_unit` char(100) default NULL,
  `parameter_column` char(100) default NULL,
  `upper_limit` double default NULL,
  `lower_limit` double default NULL,
  PRIMARY KEY  (`subdie_parameter_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of dm_wafer_subdie_parameter
-- ----------------------------

-- ----------------------------
-- Table structure for `file_operate_record`
-- ----------------------------
DROP TABLE IF EXISTS `file_operate_record`;
CREATE TABLE `file_operate_record` (
  `id` int(64) NOT NULL auto_increment COMMENT '主键',
  `file_name` varchar(255) collate utf8_unicode_ci NOT NULL COMMENT '文件名',
  `file_date` datetime default NULL COMMENT '文件修改时间',
  `classify` varchar(255) collate utf8_unicode_ci NOT NULL COMMENT '操作类型',
  `operate_result` varchar(255) collate utf8_unicode_ci NOT NULL COMMENT '操作结果',
  `gmt_create` datetime default NULL COMMENT '记录添加时间',
  PRIMARY KEY  (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of file_operate_record
-- ----------------------------
