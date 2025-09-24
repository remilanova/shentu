// в горната част на файла
import { remark } from 'remark'
import html from 'remark-html'

// по-надолу, когато рендерираш Markdown:
const processed = await remark().use(html).process(post?.body ?? '')
const bodyHtml = processed.toString()
