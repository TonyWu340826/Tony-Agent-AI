
TonyWu AI 聚合平台是一个轻量级、高灵活度的 AI 工具接入和管理系统。我们致力于解决企业内部 AI 工具分散、接入复杂、权限管理混乱的问题，构建一个统一的、安全的 AI 应用生态。
💻 功能模块概览
平台功能围绕“工具管理”和“安全使用”两大主线展开，为用户提供清晰的交互路径。
<img width="1278" height="434" alt="image" src="https://github.com/user-attachments/assets/a61a2169-8ed9-4e23-b22c-0466089ffb3f" />
1. 工具合集 (UserToolsExplorer)
功能： 用户的主入口，提供工具卡片展示、分类筛选 (GET /api/categories)、关键词搜索。
设计： 根据工具的 linkType (1, 2, 3) 动态决定加载和渲染方式，实现前端的极致灵活。

2. 智能 DBA (SQL 助手) - 旗舰工具
功能： 接收用户输入的 DDL/JSON 表结构和业务需求，调用大模型生成精确的 SQL 代码。
关键限制： 必须选择至少一张表作为前提条件，保证生成结果的准确性。
接口： POST /api/open/sql/dba

3. 认证与权限服务
功能： 用户登录 (/api/auth/login)、用户信息获取 (/api/auth/user)。
重点： 识别用户是否为 VIP99，这是访问高价值工具的唯一凭证。

🏛️ 技术与架构亮点 (System Architecture)
<img width="1322" height="523" alt="image" src="https://github.com/user-attachments/assets/73998feb-e793-4a9a-b306-f7a2fd4507fb" />
平台采用标准的前后端分离架构，但通过创新的静态资源加载机制，实现了工具的高度解耦。
<img width="1045" height="256" alt="image" src="https://github.com/user-attachments/assets/04b81df1-0a31-4397-9d72-edafd1b73ef8" />
动态加载机制 (INTERNAL LinkType)
用户点击 INTERNAL 工具。
前端进行 VIP 权限校验（最高优先级）。
通过后，使用 loadScriptOnce 动态请求后端 /tools/{id}-*.js 脚本。
脚本执行，将组件定义注册到全局 window.ToolsPages[id]。
前端容器渲染此组件。
安全放行配置 (Spring Security)


🛠️ 快速开始（Quick Start）
git clone https://github.com/your-repo/your-project.git
cd your-project
mvn spring-boot:run
访问系统：
http://localhost:8080/idnex.html  //后管端
http://localhost:8080/home.html   //用户端

-宙斯团队
