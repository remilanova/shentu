
# Shentu Portal Starter (Next.js + Supabase)

Цел: **Админ панел, добавяне/редакция на страници и постове, качване на снимки, затворена зона за абонати**.

## Какво включва
- Next.js App Router
- Supabase: **Auth** (email magic link), **DB** (Postgres), **Storage** (снимки)
- /admin (само за админ роли): CRUD за постове (title, slug, body), качване на изображения
- /members (само за логнати + роля `subscriber`)
- /blog/[slug] публични постове (по избор маркираш `is_published`)
- Примерни **RLS** политики за сигурност
- Готови SQL схеми и инструкции

## Бърз старт
1) Създай проект в **Supabase** → вземи:
   - SUPABASE_URL, ANON KEY, SERVICE ROLE
2) Копирай `.env.example` като `.env.local` и попълни стойностите.
3) В Supabase → SQL Editor → изпълни `supabase/schema.sql` (създава таблици/ролите).
4) В Supabase → Storage → създай bucket `media` (public).
5) В Supabase → Authentication → включи Email magic link.
6) `npm i` → `npm run dev`

## Роли
- В таблица `profiles` има поле `role` ∈ ('admin', 'editor', 'subscriber', 'user').
- Първият логнал се потребител → ръчно му задай role='admin' (в конзолата на Supabase).

## Абонаменти
- За платен достъп: вържи Stripe → при успешна плащане маркирай `role='subscriber'` (примерен webhook по-късно).
- За безплатна затворена зона: ръчно асайнвай `subscriber`.

## Качване на снимки
- /admin/uploads → качва в Supabase Storage `media` и връща публичен URL за вмъкване в съдържание.

Успех! (2025-09-20T15:25:37.867796)


