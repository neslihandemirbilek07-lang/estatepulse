 # 🏙️ EstatePulse — AI Destekli Gayrimenkul Platformu

> **"Emlak Dünyasının Yeni Nabzı"** — Zillow'un otomatize değerleme gücü (AVM), Redfin'in acente şeffaflığı ve canlı randevu altyapısı, Rightmove'un derin mahalle analitiği ve Sahibinden'in yerel pazar dinamizmini birleştiren, yapay zeka merkezli yeni nesil emlak platformu.

---

## ⚡ Canlı Web Uygulaması Yayında!

Uygulama yerel geliştirme sunucusunda **aktif ve çalışır durumda**:

- 🌐 **Web Arayüzü:** [http://localhost:3000](http://localhost:3000)
- 🚀 **Tek Tıkla Başlatma:** Kök dizindeki `start_estatepulse.bat` dosyasına çift tıklayarak istediğiniz zaman başlatabilirsiniz.

---

## 🌟 Uygulamada Çalışır Durumda Olan Modüller

### 1. EstatePulse AI Değerleme (AVM)
- **Konum, m², bina yaşı, kat ve donatılara göre anlık piyasa değeri hesaplama.**
- **%95 Güven Aralığı (Alt ve Üst Limitler).**
- **SHAP Özellik Etki Analizi:** Hangi unsurun fiyata ne kadar değer kattığı (Örn: Metro mesafesi `+450.000 TL`, Sıfır yapı `+380.000 TL`).
- **Gelecek Prim Projeksiyonu:** 1 yıllık ve 3 yıllık tahmini sermaye kazancı ve aylık kira getirisi öngörüsü.

### 2. Doğal Dil (NLP) Destekli Akıllı Arama
- Serbest metin girişi ile varlık tanıma (NER):
  > *"Antalya'da denize 10 dk, havuzlu, 3+1 sıfır daire"*
  > *"Kadıköy Moda'da metroya 5 dk 2+1"* 
- Arama sorgusunu oda sayısı, konum, bütçe ve donatı filtrelerine dönüştürerek ilanları **Akıllı Eşleşme Skoru (% Eşleşme)** ile sıralar.

### 3. İnteraktif Bölünmüş Harita (Split  /List) & Yaşam Katmanları
- Harita üzerinde gerçek zamanlı fiyat etiketli interaktif pinler.
- Tıklanan ilanın listede ve haritada odaklanması.
- **Dinamik Yaşam Katmanları:**
  - 🚇 *Metro & Raylı Sistem Hatları*
  - 🏫 *Okul & Eğitim Başarı Puanları*
  - 🛡️ *MTA/AFAD Zemin Sağlamlık & Deprem Riski Katmanı*

### 4. 360° Panoramik Sanal Tur (WebXR / Matterport Deneyimi)
- İlan detay sayfasında fare veya dokunmatik ekranla sürüklenebilen, 360 derece oda inceleme ve yakınlaştırma (zoom) yapabilen HTML5 Canvas panoramik gezinti modülü.

### 5. Generative AI Virtual Staging (Sanal Mobilyalama)
- Boş oda ile yapay zeka tarafından dekore edilmiş oda arasında interaktif **Öncesi / Sonrası (Before / After)** kaydırıcı bileşeni.
- Farklı mimari stiller: *Modern İskandinav*, *Lüks Akdeniz*, *Minimalist Japandi*.

### 6. Şeffaf Teklif & Dijital Pazarlık (Negotiation)
- Resmi teklif oluşturma, dijital kapora taahhüdü ve banka kredisi şartı seçimi.
- Satıcı tarafından gerçek zamanlı karşı teklif (Counter-Offer) simülasyonu ve anlaşma durumunda dijital protokol konfeti kutlaması.

### 7. Finansal Araçlar & Kredi Hesaplayıcı
- Peşinat yüzdesi ve vade ayarlamalı aylık taksit hesaplama.
- Tapu harcı (%4), döner sermaye ve emlak komisyonu gibi ek alım masraflarının net dökümü.

### 8. Danışman & Mülk Sahibi CRM Paneli
- Portföy analitiği (Görüntülenme, tıklanma, yanıt süresi).
- **Müşteri Adayları (Leads) Pipeline:** Yeni Lead &rarr; İletişimde &rarr; Randevu &rarr; Teklif &rarr; Satış.
- Gelen teklifleri canlı onaylama / karşı teklif sunma masası.

### 9. Monetization & Paketler
- Starter, Pro Danışman ve Enterprise Brokerage abonelik planları.
- AI Top Pick, Vitrin, Map Pin Glow ve Bölgesel Push Doping mağazası.

---

## 📂 Dokümantasyon & Kaynak Kodları

- 🏗️ **[docs/SYSTEM_ARCHITECTURE.md](./docs/SYSTEM_ARCHITECTURE.md):** Mikroservis mimarisi, AI pipeline ve API spesifikasyonları.
- 🗄️ **[docs/DATABASE_SCHEMA.sql](./docs/DATABASE_SCHEMA.sql):** PostgreSQL 16 + PostGIS + pgvector DDL şeması.
- 🎨 **[docs/UI_UX_AND_USER_FLOWS.md](./docs/UI_UX_AND_USER_FLOWS.md):** Ekran hiyerarşileri ve Mermaid kullanıcı akışları.
- 💰 **[docs/MONETIZATION_AND_BUSINESS.md](./docs/MONETIZATION_AND_BUSINESS.md):** SaaS, AdTech ve Fintech gelir stratejileri.
- 💻 **[client/src/](./client/src/):** Next/Vite, React, Tailwind CSS, Lucide ve Leaflet tabanlı çalışan kaynak kodlar.
