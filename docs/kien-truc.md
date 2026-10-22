# Kiến trúc & data model

```
Trình duyệt ──► Next.js 15 (App Router, ISR 60s, next-intl vi/en)
                  │  fetch REST (server components)        ▲ ảnh /assets (webp transform)
                  ▼                                         │
               Directus 11 (REST, Admin, Roles, extension `sfv-api`) ──► PostgreSQL 17
```

## Collections
| Nhóm | Collection | Ghi chú |
|---|---|---|
| Liên đoàn | `site_settings` (singleton), `pages`, `departments`, `board_members`, `clubs` (lat/lng), `disciplines` | `disciplines.confirmed=false` + `status_note` = chờ khách xác nhận |
| Nội dung | `news` (+`news_categories`, status `published/scheduled/draft`, `publish_date`), `documents`, `galleries` (+`galleries_files` M2M, `youtube_id`), `sponsors`, `home_banners` | |
| Thi đấu | `competitions` → `competition_events` → `results`; `athletes`, `national_records`, `national_teams` → `national_team_members`, `registrations` | |
| Đa ngữ | `languages` (`vi-VN`, `en-US`) + `<collection>_translations` | interface Translations của Directus |

Mọi bản ghi mẫu có `demo = true`; web hiển thị nhãn **DEMO**.

## Phân quyền
| Role | Policy | Quyền |
|---|---|---|
| Administrator | built-in | toàn quyền |
| Editor | Biên tập tin | CRUD news, categories, pages, galleries, banners, sponsors, documents, files |
| Competition Organizer | Ban tổ chức giải | CRUD competitions, events, results, athletes, clubs, records, teams, registrations, files |
| Public | `$t:public_label` | read nội dung công khai (tin chỉ khi `publish_date <= NOW`), **create** registrations (không được set `status`), read registrations `approved` (chỉ tên/CLB/năm sinh → start list) |

## Extension `cms/extensions/sfv-api` (endpoint `/sfv`)
- `GET /sfv/rankings?discipline=inline-speed&age_group=U13&gender=M&season=2026` – tổng điểm, số lượt thi, hạng tốt nhất.
- `POST /sfv/import-results?competition=<slug>` (multipart `file` .csv/.xlsx, cần đăng nhập Admin/Organizer) – nhập kết quả; tự tạo event & VĐV nếu chưa có; trả báo cáo `imported/created_athletes/errors`.

Cột file import: `competition_slug,event_code,event_name,rank,athlete_slug|athlete_name,birth_year,gender,time,score,age_group,points,status,notes` (mẫu: `cms/samples/results-sample.csv`).
