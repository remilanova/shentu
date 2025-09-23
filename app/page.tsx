'use client'

import * as React from "react";

// === Config ===
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbydTk_qbz2zdb4Vq08jIN-AkOOEfeW9WxK-w1P-8v11oJDc5OVOvqpRaRHdzs1TfCI4/exec"; // Apps Script webhook
const SECRET = "shentu_3e6c1a8d0bd643b4b5a4f2e1a9f7"; 
// === Small UI primitives (types omitted for compatibility) ===
function Btn(props) {
  const { href, onClick, children, variant = "solid", disabled = false, type } = props || {};
  const base = "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition";
  const styles = variant === "solid"
    ? "bg-[#5F7F64] text-white hover:opacity-90"
    : "bg-white/70 ring-1 ring-black/10 text-[#3F3A34] hover:bg-white";
  const disabledCls = disabled ? "opacity-50 pointer-events-none" : "";
  if (href) return <a href={href} aria-disabled={disabled} className={`${base} ${styles} ${disabledCls}`}>{children}</a>;
  return <button type={type || "button"} onClick={onClick} disabled={disabled} className={`${base} ${styles} ${disabledCls}`}>{children}</button>;
}

function Section(props) {
  const { id, title, subtitle, center = true, children } = props || {};
  return (
    <section id={id} className="py-12 md:py-16">
      {(title || subtitle) && (
        <header className={`mx-auto max-w-6xl px-4 ${center ? "text-center" : ""}`}>
          {title && <h2 className="rounded-serif text-2xl md:text-3xl">{title}</h2>}
          {subtitle && <p className={`mt-2 text-sm text-[#5A544C] ${center ? "max-w-3xl mx-auto" : "max-w-3xl"}`}>{subtitle}</p>}
        </header>
      )}
      <div className="mx-auto max-w-6xl px-4 mt-6">{children}</div>
    </section>
  );
}

function Card(props) {
  const { children, className = "" } = props || {};
  return <div className={`rounded-3xl bg-white ring-1 ring-black/10 shadow-sm p-6 md:p-8 ${className}`}>{children}</div>;
}

function Field(props) {
  const { label, children } = props || {};
  return (
    <label className="block">
      {label && <div className="text-sm font-medium text-[#3F3A34] mb-1">{label}</div>}
      {children}
    </label>
  );
}

function Input(props) {
  return <input {...props} className={`w-full rounded-xl ring-1 ring-black/10 px-3 py-2 bg-white focus:outline-none focus:ring-[#5F7F64] ${props.className||""}`} />
}

function Textarea(props) {
  return <textarea {...props} className={`w-full rounded-xl ring-1 ring-black/10 px-3 py-2 bg-white focus:outline-none focus:ring-[#5F7F64] ${props.className||""}`}/>
}

function Toggle(props) {
  const { checked, onChange, label } = props || {};
  return (
    <button
      type="button"
      onClick={() => onChange && onChange(!checked)}
      className={`flex items-center gap-2 select-none ${checked ? "text-[#3F3A34]" : "text-[#6E675F]"}`}
    >
      <span className={`h-5 w-9 rounded-full ring-1 ring-black/10 transition ${checked ? "bg-[#5F7F64]" : "bg-white"}`}
        aria-hidden="true">
        <span className={`block h-4 w-4 rounded-full bg-white shadow transform transition ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </span>
      {label}
    </button>
  );
}

// === Helpers for onsite mini-profile ===
function miniProfileFromForm(form) {
  const name = (form && form.pet && form.pet.name ? form.pet.name : "кучето").trim();
  const temp = (form && form.temperament ? String(form.temperament) : "").toLowerCase();
  let traits = "уникално и нежно";
  if (temp.includes("чувств")) traits = "чувствително и наблюдателно";
  else if (temp.includes("споко")) traits = "спокойно и устойчиво";
  else if (temp.includes("жив")) traits = "енергично и игриво";

  const world = [];
  if (form && form.towardPeople && String(form.towardPeople).trim()) world.push("общува с хора според контекста: " + String(form.towardPeople).trim());
  if (form && form.towardDogs && String(form.towardDogs).trim()) world.push("с кучета: " + String(form.towardDogs).trim());
  if (form && form.lifestyle && String(form.lifestyle).trim()) world.push("ритъмът на деня влияе силно: " + String(form.lifestyle).trim());

  const cats = ["Дишане","Храносмилане","Кожа и козина","Стави и движение"];
  const issues = [];
  cats.forEach(function(c){
    const s = form && form.health && form.health[c] ? form.health[c].status : undefined;
    if (s === 'has') {
      const note = form && form.health && form.health[c] && form.health[c].notes ? form.health[c].notes : "наблюдават се периодични сигнали";
      issues.push(c.toLowerCase() + ": " + note);
    }
  });
  const watch = issues.length ? issues : ["наблюдавайте дишането, храносмилането, кожата/козината и движението при по-силен стрес, умора или смяна на режим"];

  let food = "подходящи са нежни протеини (пуешко, агнешко) и зеленчуци като тиква, морков, зелен фасул";
  if (form && form.foodPrefs && String(form.foodPrefs).trim()) food = String(form.foodPrefs).trim();

  const worse = (form && form.worseWhen && String(form.worseWhen).trim()) ? ("Често се усилва при: " + String(form.worseWhen).trim() + ".") : "";

  return {
    title: `Профил на ${name}`,
    summary: `${name} изглежда ${traits}.`,
    world: world,
    watch: watch,
    food: food,
    worse: worse
  };
}

// === About Page ===
function AboutPage() {
  return (
    <main>
      <Section id="about-page" title="За мен и за метода Shentu" center={true}>
        <div className="grid md:grid-cols-2 items-start gap-10">
          <div className="flex justify-center md:justify-start">
            <img
              src="https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=800&auto=format&fit=crop"
              alt="Профилна снимка"
              className="w-72 h-72 md:w-80 md:h-80 rounded-full object-cover ring-1 ring-[#5F7F64]/20 shadow-sm"
            />
          </div>
          <div className="prose prose-sm max-w-none text-[#3F3A34]">
            <h3 className="!mt-0">Моят път</h3>
            <p>Никога не съм планирала да бъда това, което съм днес. Просто исках да имам куче. Но още в началото разбрах, че тази връзка е много по-дълбока от „да имаш домашен любимец“. Разбрах го по трудния начин – като признах, че не се справям.</p>
            <p>Първото ми куче ме накара да търся отговори. То беше моят първи учител. Осем години по-късно вече бях първият сертифициран Pro Dog Trainer в България и поставих началото на нова вълна в подхода към кучетата у нас.</p>
            <p>След това животът отново ме изпита – със загубата на второто ми куче, Джак. Болката отвори врата към ново разбиране: че грижата за кучето не е въпрос на удобство, а на баланс – физически, емоционален и енергиен.</p>
            <p>С всяко следващо куче идваше нов, по-дълбок пласт на комуникация. Започнах да забелязвам малките сигнали и да се доверявам на тях. Постепенно въведох и китайската медицина – като компас, който дава смисъл на всяко състояние и всяка промяна.</p>
            <p>Днес живея с осем кучета и заедно с тях продължавам да откривам по-добри начини за живот в баланс. Те ми напомнят, че този път не е само за тяхното здраве и поведение – а и за моето собствено израстване като човек.</p>
            <h3>Опит и практика</h3>
            <ul>
              <li>Като основател на фондация „По пътя с кучешките лапи“ се грижех за над 30 кучета – много от тях с травми и поведенчески проблеми, които днес живеят щастливо в новите си домове.</li>
              <li>Като консултант в Немския кастрационен център в Русе обучавах екипа и помагах да се създаде среда, в която кучетата могат да се възстановяват по-спокойно.</li>
              <li>Бях част от проект на Бандата и Dogs Trust, където направих поведенчески профили на 100 кучета чрез специализиран тест.</li>
            </ul>
            <p>Всички тези години – методите, които учих, надграждах или оставях зад гърба си – ми дадоха стабилен, личен поглед върху това какво означава да живееш с куче. Днес посвещавам времето си на това знание, за да го предавам на други хора и техните кучета.</p>
            <h3>Методът Shentu</h3>
            <p><strong>Shentu</strong> е не просто метод, а път. Името идва от две думи:</p>
            <p><strong>Shen (Шен)</strong> – духът, съзнанието, онази искра, която оживява връзката; <strong>Tu (Ту)</strong> – земята, ежедневието, стабилността, върху която всичко стъпва. Заедно те носят смисъла на моя подход: съзнание, което стъпва здраво на земята.</p>
            <h4>Три опорни стълба</h4>
            <ul>
              <li>🟤 <strong>Знание.</strong> Опирам се на традиционната китайска медицина и на дългогодишния си опит с десетки кучета. Това знание помага да стигнем до корена на проблема – дали е в тялото, в енергията или в емоциите. Вместо да гасим симптоми, можем да върнем хармонията.</li>
              <li>🟢 <strong>Природа.</strong> Храната, билките, ароматите и ритмите на сезоните са нашите съюзници. Те поддържат кучето по мек и устойчив начин – особено когато тялото му е изтощено или поведението му е зов за помощ.</li>
              <li>🔵 <strong>Присъствие.</strong> Истинската промяна идва от ежедневието. Малки ритуали, съзнателно време заедно, слушане без бързане – това са практиките, които свързват човека и кучето. Присъствието превръща методите в жива връзка.</li>
            </ul>
            <p>За хората, които идват при мен, това означава не просто „решение на проблем“, а цялостно преживяване. Ако кучето ви има поведенчески трудности – знанието и присъствието ще ги превърнат в нов начин на комуникация. Ако то страда от здравословни предизвикателства – природата и балансът ще ви покажат път отвъд безкрайните симптоматични кръгове.</p>
            <h3>Какво получавате вие</h3>
            <ul>
              <li>✨ Нов поглед върху нуждите на кучето – отвъд симптомите и „проблемите“.</li>
              <li>✨ Практични идеи как малки ежедневни действия носят голяма промяна.</li>
              <li>✨ Повече сигурност и яснота в моменти, които преди са изглеждали объркващи.</li>
              <li>✨ Връзка, която носи спокойствие, доверие и радост – и на вас, и на кучето ви.</li>
            </ul>
            <h3>Това е Shentu</h3>
            <p>Практичен път към по-здрава връзка, по-дълбоко разбиране и живот в баланс.</p>
          </div>
        </div>
      </Section>
    </main>
  );
}

// === Page ===
export default function ShentuPreview() {
  const [showWizard, setShowWizard] = React.useState(false);
  const wizardRef = React.useRef(null);

  // pseudo-pages via hash
  const [hash, setHash] = React.useState(typeof window !== 'undefined' ? window.location.hash : '');
  React.useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  // form state
  const [step, setStep] = React.useState(1);
  const total = 12;
  const [miniProfileOptIn, setMiniProfileOptIn] = React.useState(true);
  const [sending, setSending] = React.useState(false);
  const [sendError, setSendError] = React.useState(null);
  const [sent, setSent] = React.useState(false);
  const [earlyConsent, setEarlyConsent] = React.useState(false);

  const [form, setForm] = React.useState({
    owner: { email: "" },
    pet: { name: "", breed: "", age: "" },
  });

  // Contact & mobile nav state
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [contact, setContact] = React.useState({ name: "", email: "", message: "" });
  const [contactConsent, setContactConsent] = React.useState(false);
  const [contactSending, setContactSending] = React.useState(false);
  const [contactSent, setContactSent] = React.useState(false);
  const [contactError, setContactError] = React.useState(null);

  function next() { setStep(function(s){ return Math.min(total, s + 1); }); }
  function back() { setStep(function(s){ return Math.max(1, s - 1); }); }

  async function submitForm() {
    setSending(true); setSendError(null);
    try {
      const res = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: SECRET,
          miniProfileOptIn: miniProfileOptIn,
          email: (form.owner && form.owner.email) || "",
          pet: form.pet,
          form: form,
          src: (hash === '#services' || hash === '#packages') ? 'email_profile' : 'site'
        })
      });
      const j = await res.json().catch(function(){ return {}; });
      if (!res.ok || j.ok === false) throw new Error(j.error || "Грешка при изпращане");
      setSent(true);
      setStep(total);
    } catch (e) {
      setSendError(e && e.message ? e.message : "Проблем при изпращане");
    } finally {
      setSending(false);
    }
  }
  async function submitContact(e) {
    e && e.preventDefault();
    setContactSending(true); setContactError(null);
    try {
      const res = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: SECRET,
          type: "contact",
          contact: contact,
          src: "contact_form"
        })
      });
      const j = await res.json().catch(function(){ return {}; });
      if (!res.ok || j.ok === false) throw new Error(j.error || "Грешка при изпращане");
      setContactSent(true);
    } catch (e) {
      setContactError(e && e.message ? e.message : "Проблем при изпращане");
    } finally {
      setContactSending(false);
    }
  }

  // dynamic health card title
  const healthTitle = (form.pet && form.pet.name && form.pet.name.trim().length > 0)
    ? `Здравна карта на ${form.pet.name.trim()}`
    : 'Здравна карта';
  const isAboutPage = hash === '#about-page';

  // === NAVBAR ===
  const NavLink = function({ href, children }) { return (
    <a href={href} className="px-3 py-2 text-sm text-[#3F3A34] hover:text-[#5F7F64]">{children}</a>
  ); };

  return (
    <div className="min-h-screen bg-[#F7F5F2] text-[#3F3A34] rounded-font">
      {/* Global fonts (rounded) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&family=Quicksand:wght@600;700&display=swap');
        :root { --font-rounded: 'Nunito', system-ui, -apple-system, Segoe UI, Roboto, sans-serif; --font-rounded-head: 'Quicksand','Nunito', system-ui, sans-serif; }
        .rounded-font { font-family: var(--font-rounded); }
        .rounded-serif { font-family: var(--font-rounded-head); letter-spacing: .2px; }
      `}</style>

      {/* TOP NAV */}
      <div className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-black/10">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <a href="#home" className="rounded-serif text-lg">Shentu</a>
          <nav className="hidden md:flex items-center">
            <NavLink href="#about-page">За мен</NavLink>
            <NavLink href="#services">Услуги</NavLink>
            <NavLink href="#guides">Грижа и знание</NavLink>
            <NavLink href="#blog">Блог</NavLink>
            <NavLink href="#contact">Контакт</NavLink>
          </nav>
          <button
            className="md:hidden inline-flex items-center justify-center rounded-xl px-3 py-2 ring-1 ring-black/10"
            aria-label="Отвори меню"
            onClick={()=>setMobileOpen(!mobileOpen)}
          >
            ☰
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-black/10 bg-white/90">
            <nav className="mx-auto max-w-6xl px-4 py-2 flex flex-col">
              <a href="#about-page" className="px-3 py-2 text-sm" onClick={()=>setMobileOpen(false)}>За мен</a>
              <a href="#services" className="px-3 py-2 text-sm" onClick={()=>setMobileOpen(false)}>Услуги</a>
              <a href="#guides" className="px-3 py-2 text-sm" onClick={()=>setMobileOpen(false)}>Грижа и знание</a>
              <a href="#blog" className="px-3 py-2 text-sm" onClick={()=>setMobileOpen(false)}>Блог</a>
              <a href="#contact" className="px-3 py-2 text-sm" onClick={()=>setMobileOpen(false)}>Контакт</a>
            </nav>
          </div>
        )}
      </div>

      {isAboutPage && <AboutPage />}

      {/* HERO with background image under text (скрит на about-page) */}
      {!isAboutPage && (
        <>
          <header id="home" className="relative">
            <img src="https://images.unsplash.com/photo-1534361960057-19889db9621e?q=80&w=2000&auto=format&fit=crop" alt="hero" className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-[#2d2a26]/30" />
            <div className="relative mx-auto max-w-6xl px-4 py-20 md:py-28 text-center text-white">
              <h1 className="rounded-serif text-3xl md:text-5xl leading-tight">Ритуали за здраве за теб и твоето куче</h1>
              <p className="mt-4 max-w-3xl mx-auto text-white/90">Изготвяне на индивидуален план за хранене, емоционален баланс и дългосрочно здраве. Персонална грижа, която започва отвътре навън.</p>
              <div className="mt-8 flex flex-wrap gap-3 justify-center">
                <Btn disabled={!earlyConsent} onClick={(e)=>{ 
                  e.preventDefault(); 
                  if(!earlyConsent) return; 
                  setShowWizard(true); 
                  setStep(1);
                  setTimeout(()=>{ wizardRef.current?.scrollIntoView({behavior:'smooth'}); }, 50);
                }}>Продължете</Btn>
                <Btn href="#about-page" variant="ghost">За метода</Btn>
              </div>
            </div>
          </header>

          {/* ABOUT teaser */}
          <Section id="about" title="За мен" center={true}>
            <div className="grid md:grid-cols-2 items-start gap-10">
              <div className="flex justify-center md:justify-start">
                <img
                  src="https://images.unsplash.com/photo-1544006659-f0b21884ce1d?q=80&w=800&auto=format&fit=crop"
                  alt="Профилна снимка"
                  className="w-72 h-72 md:w-80 md:h-80 rounded-full object-cover ring-1 ring-[#5F7F64]/20 shadow-sm"
                />
              </div>
              <div className="prose prose-sm max-w-none text-[#3F3A34]">
                <p>Казвам се Ралица и вярвам, че връзката между човека и кучето е едно от най-силните и лекуващи неща. Моето пътуване започна преди повече от 15 години и оттогава се посветих на това да намирам по-меки и естествени начини за грижа.</p>
                <p className="!mt-3">Философията зад Shentu е проста и в същото време дълбока – връзката между човек и куче е жив организъм, който расте, когато бъде хранен с уважение и внимание. Вярвам, че всяко куче носи своята мъдрост и задачата ни не е да го „поправяме“, а да го чуем и да откликнем.</p>
                <p className="!mt-3">Прочетете целия ми път, опита ми и трите стълба на метода Shentu.</p>
                <div className="mt-4"><Btn href="#about-page">Прочетете повече</Btn></div>
              </div>
            </div>
          </Section>

          {/* TESTIMONIALS */}
          <Section id="testimonials" title="Истории на доверие" subtitle="Кратки откъси от реални случаи.">
            <div className="overflow-x-auto no-scrollbar">
              <div className="flex gap-4 min-w-[640px]">
                {[
                  { img: "https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?q=80&w=800&auto=format&fit=crop", text: "След месец работа Луно спи спокойно и търси контакт без напрежение.", who:"Веси за Луно" },
                  { img: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=800&auto=format&fit=crop", text: "Марго вече не пази купичката – ритуалите и ясните граници свършиха чудеса.", who:"Иво за Марго" },
                  { img: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=800&auto=format&fit=crop", text: "Тери се отпусна сред хора – когато темпото ни стана по-спокойно, той избра да дойде сам.", who:"Мая за Тери" },
                ].map((c, i)=> (
                  <div key={i} className="flex items-center gap-4 bg-white/70 ring-1 ring-black/5 rounded-2xl p-4 min-w-[360px]">
                    <img src={c.img} alt="case" className="w-16 h-16 rounded-xl object-cover"/>
                    <div className="text-sm"><div className="text-[#3F3A34]">{c.text}</div><div className="mt-1 text-[#6E675F]">{c.who}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </Section>

          {/* MINI HEALTH CARD */}
          <Section title={healthTitle} subtitle="Попълнете празните полета, после ще се отвори пълният въпросник.">
            <div className="max-w-6xl mx-auto">
              <Card>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-end">
                  <Field label="Име на кучето"><Input value={(form.pet && form.pet.name) || ""} onChange={(e)=>setForm({...form, pet:{...(form.pet||{}), name:e.target.value}})} /></Field>
                  <Field label="Порода"><Input value={(form.pet && form.pet.breed) || ""} onChange={(e)=>setForm({...form, pet:{...(form.pet||{}), breed:e.target.value}})} /></Field>
                  <Field label="Възраст"><Input value={(form.pet && form.pet.age) || ""} onChange={(e)=>setForm({...form, pet:{...(form.pet||{}), age:e.target.value}})} /></Field>
                  <Field label="Вашият имейл"><Input type="email" value={(form.owner && form.owner.email) || ""} onChange={(e)=>setForm({...form, owner:{...(form.owner||{}), email:e.target.value}})} placeholder="name@example.com"/></Field>
                </div>
                <div className="mt-3 flex items-start gap-2">
                  <input id="consent-early" type="checkbox" checked={earlyConsent} onChange={(e)=>setEarlyConsent(!!e.target.checked)} />
                  <label htmlFor="consent-early" className="text-xs text-[#5A544C]">Съгласявам се предоставените данни да бъдат обработвани за целите на услугата и за връзка с мен.</label>
                </div>
                <div className="mt-4">
                  <Btn disabled={!earlyConsent} onClick={(e)=>{e.preventDefault(); if(!earlyConsent) return; setShowWizard(true); setStep(1); setTimeout(()=>{ if(wizardRef.current) wizardRef.current.scrollIntoView({behavior:'smooth'}); }, 50);}}>Продължете</Btn>
                  {!earlyConsent && <div className="text-xs text-[#6E675F] mt-2">За да продължите, е нужно съгласие за обработка на данни.</div>}
                </div>
              </Card>

              <Card className="mt-4 bg-gradient-to-br from-[#5F7F64] to-[#4b6d57] text-white ring-1 ring-[#5F7F64]/30">
                <div className="text-sm">
                  <p className="font-semibold">Искате да разберете повече за същността на вашето куче?</p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>как възприема света и типичните му предпочитания (контакт, движение, почивка);</li>
                    <li>ранни сигнали за <strong>заболявания</strong> или <strong>промени в поведението</strong>, за които да наблюдавате;</li>
                    <li>базови насоки за грижа (ритъм, среда) и примерни идеи за хранене (основни протеини и зеленчуци).</li>
                  </ul>
                  <p className="mt-2 opacity-95">В края на въпросника ще видите резултата директно тук, а по желание може да получите копие и по имейл.</p>
                </div>
              </Card>
            </div>
          </Section>

          {/* WIZARD */}
          {showWizard && (
            <Section id="start" title="Индивидуален план – въпросник" subtitle="По една стъпка, без напрежение. Отворени отговори там, където е нужно да разкажете повече.">
              <div ref={wizardRef} />
              <Card>
                {/* Steps header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="text-sm">Стъпка {step} от {total}</div>
                  <div className="flex gap-2">
                    {step>1 && <Btn variant="ghost" onClick={(e)=>{e.preventDefault(); back();}}>Назад</Btn>}
                    {step<total && <Btn onClick={(e)=>{e.preventDefault(); next();}}>Продължете</Btn>}
                  </div>
                </div>

                {/* Step content */}
                <div className="grid gap-6">
                  {step===1 && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Разкажете историята му">
                        <Textarea rows={6} placeholder="Моменти, промени, навици, среда…" value={form.story||""} onChange={(e)=>setForm({...form, story:e.target.value})} />
                      </Field>
                      <Field label="Всекидневие (разходки, игра, сън)">
                        <Textarea rows={6} placeholder="Как минава един типичен ден?" value={form.lifestyle||""} onChange={(e)=>setForm({...form, lifestyle:e.target.value})} />
                      </Field>
                    </div>
                  )}

                  {step===2 && (
                    <div className="grid gap-4">
                      <h4 className="font-semibold">Здравна история (хронологично)</h4>
                      <p className="text-sm text-[#5A544C]">Опишете здравната история на кучето <strong>откакто е с вас</strong>, в <strong>хронологичен ред</strong>. Добавете сегашните симптоми, диагнози, лечение и терапии (минали и настоящи), и болести, през които е преминало. Ако има препоръки от ветеринар/друг практик, включете ги.</p>
                      <Field label="Разкажете подробно"><Textarea rows={8} value={form.healthStory||""} onChange={(e)=>setForm({...form, healthStory:e.target.value})} placeholder="Започнете от началото и вървете напред…"/></Field>
                    </div>
                  )}

                  {step===3 && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Кога се влошава?">
                        <Textarea rows={6} value={form.worseWhen||""} onChange={(e)=>setForm({...form, worseWhen:e.target.value})} placeholder="Има ли моменти от деня/годината, когато е по-видимо? Опишете."/>
                      </Field>
                      <Field label="Какво най-много харесвате в него?">
                        <Textarea rows={6} value={form.likeMost||""} onChange={(e)=>setForm({...form, likeMost:e.target.value})} placeholder="Жестове, навици, качества…"/>
                      </Field>
                    </div>
                  )}

                  {step===4 && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Отношение към други кучета"><Textarea rows={5} value={form.towardDogs||""} onChange={(e)=>setForm({...form, towardDogs:e.target.value})} placeholder="Как реагира? В какви ситуации?"/></Field>
                      <Field label="Отношение към хора"><Textarea rows={5} value={form.towardPeople||""} onChange={(e)=>setForm({...form, towardPeople:e.target.value})} placeholder="Какво го улеснява/затруднява?"/></Field>
                    </div>
                  )}

                  {step===5 && (
                    <div className="grid gap-4">
                      <h4 className="font-semibold">Симптоми по категории</h4>
                      <p className="text-sm text-[#5A544C]">За всяка категория изберете „няма оплаквания“ или „има — опишете“. Ако нещо е спокойно — оставете го празно.</p>
                      {["Дишане","Храносмилане","Кожа и козина","Стави и движение"].map((cat,idx)=> (
                        <div key={idx} className="grid gap-2 md:grid-cols-[220px,1fr] items-start">
                          <div className="text-sm font-medium mt-2">{cat}</div>
                          <div className="grid gap-2">
                            <select className="w-full rounded-xl ring-1 ring-black/10 px-3 py-2 bg-white" value={(form.health && form.health[cat] && form.health[cat].status) || ""} onChange={(e)=>setForm({...form, health:{...(form.health||{}), [cat]:{...((form.health&&form.health[cat])||{}), status:e.target.value}}})}>
                              <option value="">Изберете…</option>
                              <option value="none">няма оплаквания</option>
                              <option value="has">има — опишете</option>
                            </select>
                            {(form.health && form.health[cat] && form.health[cat].status==="has") && (
                              <Textarea rows={4} placeholder="Опишете симптоми, честота, кога се влошава/подобрява…" value={(form.health && form.health[cat] && form.health[cat].notes) || ""} onChange={(e)=>setForm({...form, health:{...(form.health||{}), [cat]:{...((form.health&&form.health[cat])||{}), notes:e.target.value}}})} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {step===6 && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Хранене (какво, колко често, отношение към храна)"><Textarea rows={6} value={form.diet||""} onChange={(e)=>setForm({...form, diet:e.target.value})} placeholder="Режим, протеини, зеленчуци, порции, капризност…"/></Field>
                      <Field label="Съставки/храни, които харесва или избягва"><Textarea rows={6} value={form.foodPrefs||""} onChange={(e)=>setForm({...form, foodPrefs:e.target.value})} placeholder="Любими/ труднопоносими храни (ако има наблюдения)."/></Field>
                    </div>
                  )}

                  {step===7 && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Роля в семейството"><Textarea rows={5} value={form.familyRole||""} onChange={(e)=>setForm({...form, familyRole:e.target.value})}/></Field>
                      <Field label="Темперамент (спокоен/жив/чувствителен)"><Textarea rows={5} value={form.temperament||""} onChange={(e)=>setForm({...form, temperament:e.target.value})}/></Field>
                    </div>
                  )}

                  {step===8 && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Кой се грижи основно"><Input value={form.mainCarer||""} onChange={(e)=>setForm({...form, mainCarer:e.target.value})}/></Field>
                      <Field label="Кой живее в дома (хора/кучета)"><Textarea rows={5} value={form.whoLives||""} onChange={(e)=>setForm({...form, whoLives:e.target.value})}/></Field>
                    </div>
                  )}

                  {step===9 && (
                    <div className="grid gap-4">
                      <h4 className="font-semibold">Цели и надежди</h4>
                      <Field label="Какво искате най-много да се подобри?">
                        <Textarea rows={6} value={form.hopes||""} onChange={(e)=>setForm({...form, hopes:e.target.value})}/>
                      </Field>
                    </div>
                  )}

                  {step===10 && (
                    <div className="grid gap-4 md:grid-cols-2">
                      <Field label="Вашето име и фамилия"><Input value={(form.owner && form.owner.name) || ""} onChange={(e)=>setForm({...form, owner:{...(form.owner||{}), name:e.target.value}})} /></Field>
                      <Field label="Телефон (по желание)"><Input value={(form.owner && form.owner.phone) || ""} onChange={(e)=>setForm({...form, owner:{...(form.owner||{}), phone:e.target.value}})} /></Field>
                    </div>
                  )}

                  {step===11 && (
                    <div className="grid gap-4">
                      <h4 className="font-semibold">Съгласие</h4>
                      <p className="text-sm text-[#5A544C]">Предоставената информация и препоръки не са заместител на ветеринарна/медицинска помощ. Съдържанието е с образователна цел, а решенията за грижа се вземат от вас. С отбелязване по-долу се съгласявате с обработването на лични данни за целите на услугата и с общите условия.</p>
                      <label className="inline-flex items-center gap-2">
                        <input type="checkbox" checked={!!form.consent} onChange={(e)=>setForm({...form, consent: !!e.target.checked})} />
                        <span>Съгласен/на съм</span>
                      </label>
                      <div className="grid gap-4 md:grid-cols-2">
                        <Field label="Име и фамилия (подпис)"><Input value={form.consentName||""} onChange={(e)=>setForm({...form, consentName:e.target.value})}/></Field>
                        <Field label="Дата"><Input placeholder="дд.мм.гггг" value={form.consentDate||""} onChange={(e)=>setForm({...form, consentDate:e.target.value})}/></Field>
                      </div>
                      <div className="pt-2">
                        <Toggle checked={miniProfileOptIn} onChange={setMiniProfileOptIn} label="Изпратете ми безплатен „Профил на кучето“ по имейл" />
                      </div>
                    </div>
                  )}

                  {step===12 && (
                    <div className="grid gap-4">
                      {sent ? (
                        <div className="grid gap-4">
                          <h4 className="font-semibold">Резултат</h4>
                          {(() => { const m = miniProfileFromForm(form); return (
                            <div className="rounded-2xl bg-white ring-1 ring-black/10 p-5">
                              <h5 className="rounded-serif text-lg">{m.title}</h5>
                              <p className="mt-2 text-sm text-[#5A544C]">{m.summary}</p>
                              {m.world && m.world.length>0 && (
                                <div className="mt-3">
                                  <div className="text-sm font-medium">Как възприема света</div>
                                  <ul className="mt-1 text-sm list-disc pl-5">{m.world.map((w,i)=>(<li key={i}>{w}</li>))}</ul>
                                </div>
                              )}
                              <div className="mt-3">
                                <div className="text-sm font-medium">Към какво е предразположено</div>
                                <ul className="mt-1 text-sm list-disc pl-5">{m.watch.map((w,i)=>(<li key={i}>{w}</li>))}</ul>
                              </div>
                              {m.worse && <p className="mt-2 text-sm">{m.worse}</p>}
                              <div className="mt-3">
                                <div className="text-sm font-medium">Хранене (ориентир)</div>
                                <p className="text-sm">{m.food}</p>
                              </div>
                              <p className="mt-4 text-xs text-[#6E675F]">Това резюме е ориентировъчно и не замества ветеринарна грижа.</p>
                              <div className="mt-4 flex flex-wrap gap-3">
                                <Btn href="#services">Поръчайте индивидуален план</Btn>
                                <Btn href="#home" variant="ghost">Към началото</Btn>
                              </div>
                            </div>
                          ); })()}
                        </div>
                      ) : (
                        <div className="grid gap-3">
                          {sendError && <div className="text-sm text-red-600">{sendError}</div>}
                          <Btn onClick={(e)=>{e.preventDefault(); submitForm();}}>{sending ? "Изпращане…" : "Изпратете заявката"}</Btn>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Card>

              {/* Wizard footer controls */}
              <div className="mt-6 flex items-center justify-between">
                <div className="text-xs text-[#6E675F]">Стъпка {step} от {total}</div>
                <div className="flex gap-2">
                  {step>1 && <Btn variant="ghost" onClick={(e)=>{e.preventDefault(); back();}}>Назад</Btn>}
                  {step<total && <Btn onClick={(e)=>{e.preventDefault(); next();}}>Продължете</Btn>}
                </div>
              </div>
            </Section>
          )}

          {/* BLOG */}
          <Section id="blog" title="От блога" subtitle="Нежни практики и знание, което приземява ежедневието.">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Как темпото ни учи кучето на спокойствие", img:"https://images.unsplash.com/photo-1507149833265-60c372daea22?q=80&w=800&auto=format&fit=crop" },
                { title: "Малки сигнали, големи промени", img:"https://images.unsplash.com/photo-1466921583968-f07aa80c526e?q=80&w=800&auto=format&fit=crop" },
                { title: "Храната като ритуал, а не задача", img:"https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop" },
              ].map((p,i)=> (
                <a key={i} href="#" className="group block rounded-3xl overflow-hidden bg-white ring-1 ring-black/10">
                  <img src={p.img} alt="post" className="h-40 w-full object-cover"/>
                  <div className="p-5">
                    <h3 className="text-base font-semibold group-hover:underline underline-offset-4 decoration-[#5F7F64]/40">{p.title}</h3>
                    <p className="mt-1 text-sm text-[#6E675F]">Прочетете статията</p>
                  </div>
                </a>
              ))}
            </div>
          </Section>

          {/* GUIDES / RESOURCES */}
          <Section id="guides" title="Грижа и знание" subtitle="Наръчници и дигитални ресурси за спокойствие, връзка и ежедневна грижа.">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: "Наръчник за стрес при кучета", desc: "Разпознаване на ранни сигнали + първи стъпки за успокояване.", badge:"Скоро", img:"https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=800&auto=format&fit=crop" },
                { title: "Мини-курс: Ритъм и граници", desc: "Лек 5-дневен имейл курс с ежедневни техники.", badge:"Скоро", img:"https://images.unsplash.com/photo-1484249170766-998fa6efe3c0?q=80&w=800&auto=format&fit=crop" },
                { title: "Дневник за наблюдения", desc: "Печатни страници за следене на навици, симптоми и напредък.", badge:"PDF", img:"https://images.unsplash.com/photo-1487700160041-babef9c3cb55?q=80&w=800&auto=format&fit=crop" },
              ].map((g,i)=> (
                <div key={i} className="rounded-3xl overflow-hidden bg-white ring-1 ring-black/10 flex flex-col">
                  <div className="relative">
                    <img src={g.img} alt="guide" className="h-40 w-full object-cover" />
                    <span className="absolute top-3 right-3 text-xs bg-white/90 rounded-full px-2 py-1 ring-1 ring-black/10">{g.badge}</span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-base font-semibold">{g.title}</h3>
                    <p className="mt-1 text-sm text-[#5A544C]">{g.desc}</p>
                    <div className="mt-4 flex gap-2">
                      <Btn href="#" variant="ghost">Виж повече</Btn>
                      <Btn href="#" disabled>Купи</Btn>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* SERVICES */}
          {(hash === '#services' || hash === '#packages') && (
            <Section id="services" title="Услуги" subtitle="Когато сте готови — изберете най-подходящата опция.">
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { name: "Пакет 1", price: "180 лв.", period: "1 месец", bullets: [
                    "Мултибалансен анализ (начало)",
                    "Протокол за 1 месец (храна, масла, ежедневни насоки)",
                    "3 етерични масла + насоки за ароматерапия",
                    "Мултибалансен анализ в края на месеца"
                  ] },
                  { name: "Пакет 2", price: "240 лв.", period: "1 месец", bullets: [
                    "МБА (начало) + подробен протокол (психоемоционални насоки, храна, масла, билки, точки)",
                    "До 7 етерични масла + насоки",
                    "МБА в края на месеца"
                  ] },
                  { name: "Програма 6 месеца", price: "680 лв.", period: "6 месеца", bullets: [
                    "МБА в началото на всеки месец (или при нужда)",
                    "Протоколи след всеки МБА (психоемоционални насоки, храна, масла, билки, точки)",
                    "Неограничен брой етерични масла + насоки",
                    "Работа и с човека и нагласата"
                  ] }
                ].map((p, i) => (
                  <Card key={i}>
                    <div className="flex flex-col h-full">
                      <h3 className="text-lg font-semibold">{p.name}</h3>
                      <div className="text-sm text-[#5A544C]">{p.period}</div>
                      <div className="mt-2 text-2xl rounded-serif">{p.price}</div>
                      <ul className="mt-3 text-sm list-disc pl-5 space-y-1">
                        {p.bullets.map((b,bi)=>(<li key={bi}>{b}</li>))}
                      </ul>
                      <div className="mt-4 flex gap-2">
                        <Btn href="#bank">Плащане по банков превод</Btn>
                        <Btn href="#" variant="ghost">Плати с карта</Btn>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </Section>
          )}

          {/* BANK TRANSFER INFO */}
          <Section id="bank" title="Плащане по банков превод (48 часа резервация)" subtitle="Моля, преведете сумата и запишете основанието точно както е изписано.">
            <Card>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div><strong>IBAN:</strong> ________</div>
                  <div><strong>Титуляр:</strong> Shentu / „По пътя с кучешките лапи“ ЕООД</div>
                  <div><strong>Сума:</strong> според избрания пакет</div>
                  <div><strong>Основание:</strong> SHENTU-ORDER-#1234</div>
                  <div className="mt-2">Срок за превод: 48 часа. След постъпване на сумата ще получите e-mail потвърждение и обаждане.</div>
                </div>
                <div className="text-[#5A544C]">
                  <p className="font-medium">Сигурно плащане с карта</p>
                  <p className="mt-1">Банката Ви може да поиска кратко потвърждение (най-често SMS код). Ако не получите код до 60 сек., натиснете „Изпрати отново“ или изберете банков превод.</p>
                </div>
              </div>
            </Card>
          </Section>

          {/* CONTACT */}
          <Section id="contact" title="Свържете се с мен" subtitle="Ще се върна при вас възможно най-скоро.">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                {contactSent ? (
                  <div className="text-sm">Благодаря! Съобщението е изпратено.</div>
                ) : (
                  <form onSubmit={submitContact} className="grid gap-3">
                    <Field label="Име"><Input value={contact.name} onChange={(e)=>setContact({...contact, name:e.target.value})}/></Field>
                    <Field label="Имейл"><Input type="email" value={contact.email} onChange={(e)=>setContact({...contact, email:e.target.value})}/></Field>
                    <Field label="Съобщение"><Textarea rows={5} value={contact.message} onChange={(e)=>setContact({...contact, message:e.target.value})}/></Field>
                    <label className="inline-flex items-center gap-2 text-xs text-[#5A544C]">
                      <input type="checkbox" checked={contactConsent} onChange={(e)=>setContactConsent(!!e.target.checked)} />
                      <span>Съгласен/на съм с обработката на данните за целите на контакта.</span>
                    </label>
                    {contactError && <div className="text-sm text-red-600">{contactError}</div>}
                    <div>
                      <Btn type="submit" disabled={!contactConsent || contactSending}>{contactSending ? "Изпращане…" : "Изпрати"}</Btn>
                    </div>
                  </form>
                )}
              </Card>
              <div className="text-sm text-[#5A544C] self-center">
                <p><strong>E-mail:</strong> r.e.milanova@gmail.com</p>
              </div>
            </div>
          </Section>

          {/* FOOTER */}
          <footer className="border-t border-black/10 bg-white/60">
            <div className="mx-auto max-w-6xl px-4 py-8 text-sm">
              <div className="text-[#3F3A34]">„Shentu“ е търговско наименование на „По пътя с кучешките лапи“ ЕООД · ЕИК: 117517264 · адрес: с. Тръстеник, общ. Иваново, ул. Скобелев 35</div>
              <div className="mt-2 flex flex-wrap gap-3">
                <a href="/privacy.html" className="hover:underline">Поверителност</a>
                <a href="/cookies.html" className="hover:underline">Бисквитки</a>
                <a href="/delivery.html" className="hover:underline">Доставка</a>
                <a href="/returns.html" className="hover:underline">Връщане</a>
                <a href="/terms.html" className="hover:underline">Общи условия</a>
                <a href="/disclaimer.html" className="hover:underline">Отказ от отговорност</a>
              </div>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}


