# clayja-region-data · 通过 jsDelivr 访问说明

本包已发布到 npm，可直接通过 jsDelivr CDN 访问静态 JSON 数据，无需安装或部署。本文档描述访问规则与推荐实践。

## 访问规则
- 基础路径（最新版本）：  
  `https://cdn.jsdelivr.net/npm/clayja-region-data/<子目录>/<文件名>`
  - 示例（省份列表）：`https://cdn.jsdelivr.net/npm/clayja-region-data/address/provinces.json`
- 指定版本（推荐）：  
  `https://cdn.jsdelivr.net/npm/clayja-region-data@<版本号>/<子目录>/<文件名>`
  - 示例：`https://cdn.jsdelivr.net/npm/clayja-region-data@1.0.0/address/provinces.json`
  - 说明：固定版本的 URL 内容不可变，有助于避免“最新版”更新带来的潜在破坏性变更。
- 指定主版本：  
  `https://cdn.jsdelivr.net/npm/clayja-region-data@<主版本>/<子目录>/<文件名>`
  - 示例：`https://cdn.jsdelivr.net/npm/clayja-region-data@1/address/provinces.json`

## 文件结构速查（address）
- 省份列表：`address/provinces.json`
- 某省的城市列表：`address/cities_<省份代码>.json`  
  - 示例：`address/cities_440000.json`（广东省）
- 某城市的区县列表：`address/areas_<城市代码>.json`  
  - 示例：`address/areas_440300.json`（深圳市）

省份代码与城市代码均为标准行政区划代码，数据结构通常包含 `id` / `value`（代码）与 `text`（名称）。

## 文件结构速查（international）
- 国家列表：`international/countries.json`
  - 结构示例：`[{ "id": "country_6_", "text": "美国", "zone": -5 }, ...]`
- 某国家的城市列表：`international/cities_<国家ID>.json`
  - 命名规则：以国家列表中的 `id` 直接拼接，例如 `id=country_6_` 对应 `international/cities_country_6_.json`
  - 结构示例：`[{ "id": "country_6__city_1", "text": "纽约", "zone": -5, "lng": -74.02, "iana": "America/New_York" }, ...]`
  - 示例 URL：`https://cdn.jsdelivr.net/npm/clayja-region-data/international/cities_country_6_.json`

## 使用示例
- 浏览器（fetch）：
  ```js
  const url = 'https://cdn.jsdelivr.net/npm/clayja-region-data/address/provinces.json';
  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data); // 省份数组
    });
  ```
- Node.js（fetch 或 axios）：
  ```js
  import axios from 'axios';
  const url = 'https://cdn.jsdelivr.net/npm/clayja-region-data@1.0.0/address/cities_440000.json';
  const { data } = await axios.get(url);
  console.log(data); // 指定省份的城市数组
  ```
- 命令行（curl）：
  ```bash
  curl -s https://cdn.jsdelivr.net/npm/clayja-region-data/address/areas_440300.json | jq '.'
  ```

## CDN 与缓存
- jsDelivr 会对版本化 URL 进行全局缓存；固定版本的内容稳定且可长期缓存。
- 使用不带版本的“最新”路径时，发布新版本后 CDN 会刷新为新内容，可能产生不可预期的变更。
- 生产环境强烈建议固定版本号。

## 数据格式与兼容性
- 内容类型：`application/json`，可直接作为静态数据消费。
- 跨域：jsDelivr 默认支持跨域访问，适用于前端直接请求。
- 稳定性建议：对关键业务请锁定版本并在升级前进行数据兼容性验证。

## 快速示例（省份数据片段）
```json
[
  { "id": "110000", "text": "北京市", "value": "110000" },
  { "id": "310000", "text": "上海市", "value": "310000" },
  { "id": "440000", "text": "广东省", "value": "440000" }
]
```

## 快速示例（国际数据片段）
- 国家：
```json
[
  { "id": "country_6_", "text": "美国", "zone": -5 },
  { "id": "country_8_", "text": "英国", "zone": 0 }
]
```
- 城市（美国）：
```json
[
  { "id": "country_6__city_2", "text": "纽约", "zone": -5, "lng": -74.02, "iana": "America/New_York" }
]
```

## 常见问题
- 访问 404：请确认路径、文件名与代码是否正确（如 `cities_440000.json`、`areas_440300.json`）。
- 内容更新：如需立即使用最新数据，发布新版本后使用不带版本的路径或更新到新版本号。
