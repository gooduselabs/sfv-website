# Migrations

Schema được quản lý bằng **Directus schema snapshot** (`../schema/snapshot.yaml`).

- Áp dụng schema lên DB mới: `npm run schema:apply`
- Sau khi sửa data model trong Admin: `npm run schema:snapshot` rồi commit file YAML.
- Thay đổi dữ liệu/permission dạng code: thêm script idempotent trong `../scripts/` (vd. `setup-roles.mjs`, `admin-ux.mjs`).

Directus cũng hỗ trợ custom migrations (thư mục `MIGRATIONS_PATH`), dùng khi cần SQL thuần (index, view…).
