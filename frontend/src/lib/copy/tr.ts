import type { UiCopy } from "./types";

export const TR: UiCopy = {
  welcome: {
    brand: "Invest Smarter",
    kicker: "Fizibilite öncesi yapılandırılmış yatırım ve proje ön taraması.",
    headline: "",
    description:
      "Bir yatırım fikrini, kamu projesini veya kalkınma finansmanı dosyasını 12 soruluk yönlendirilmiş görüşme ile değerlendirin ve kural tabanlı ilk öneri alın.",
    start: "Değerlendirmeye başla",
    prototypeNote:
      "Bu prototip fizibilite raporu, finansal model, hibe kararı veya yatırım tavsiyesi üretmez.",
    interviewTimeLabel: "Tahmini görüşme süresi:",
    interviewTimeValue: "8 dakika",
    reportTimeLabel: "Öneri:",
    reportTimeValue: "Bu oturumda",
    bootstrapIdea: "Yeni yatırım fırsatı",
    features: [
      {
        title: "Yapılandırılmış görüşme",
        description:
          "Özel sektör, kamu ve kalkınma finansmanı fırsatları için 12 soruluk yönlendirilmiş ön tarama.",
      },
      {
        title: "Öneri öncesi gözden geçirme",
        description:
          "Her öneri üretilmeden önce cevapları kontrol edin.",
      },
      {
        title: "Kural tabanlı karar kartı",
        description:
          "Güven düzeyi ve koşullarla birlikte deterministik ilk öneri alın.",
      },
      {
        title: "Değerlendirici kaydı",
        description:
          "Değerlendiricinin öneriyi kabul, tadil veya ret durumunu kaydedin.",
      },
    ],
  },
  chrome: {
    next: "İleri",
    previous: "Geri",
    cancel: "Vazgeç",
    startInterview: "Görüşmeyi başlat",
    questionOf: (current, total) => `Soru ${current} / ${total}`,
    minutesLeft: (minutes) => `Yaklaşık ${minutes} dakika kaldı`,
    newOpportunity: "Yeni fırsat",
    edit: "Düzenle",
    selected: "Seçildi",
    other: "Diğer",
    languageGroupLabel: "Dil",
    englishShort: "EN",
    turkishShort: "TR",
  },
  framing: {
    title: "Başlamadan önce",
    message:
      "On iki soruluk, yaklaşık sekiz dakikalık yapılandırılmış bir görüşme. Analizden önce tüm yanıtları gözden geçireceksiniz. Bildiğiniz kadarını yazın; çoğu soruda “henüz emin değilim” kabul edilir.",
  },
  projectContext: {
    kicker: "Hazırlık",
    title: "Neyi değerlendiriyorsunuz?",
    message:
      "Bu seçim, soruların ve önerinin doğru çerçevede kalmasını sağlar.",
  },
  q1: {
    title: "Fırsatın türü",
    message:
      "Önce bu fırsatın biçimini netleştireyim. Hangi ticari ve saha sorularının önemli olduğunu bu belirler.",
  },
  q2: {
    title: "Sektör",
    message:
      "Bunu hangi sektörde değerlendirmeliyim? Piyasa ve düzenleme bağlamını buna göre yüklerim.",
    allSectors: "Tüm sektörler",
    searchPlaceholder: "Ada veya koda göre ara",
    describeSector: "Sektörü tanımlayın",
    sectorOtherPlaceholder: "ör. Atıktan enerji",
    sectorOtherHelper:
      "3–40 karakter. Yalnızca harf, rakam, boşluk ve tire.",
  },
  q3: {
    title: "Ne üretir veya sunar",
    message:
      "Tek satırda bu yatırım ne üretecek veya sunacak? Bunu ürün tanımı olarak kullanırım — iş planı olarak değil.",
    fieldLabel: "Ürün veya çıktı",
    placeholder: "ör. 50 MW güneş santrali",
    helper: "8–80 karakter. Çipler alanı doldurur; düzenleyebilirsiniz.",
  },
  q4: {
    title: "Ülke",
    message:
      "Yatırım nerede? Piyasa ve düzenleme değerlendirmesi için ülke zorunludur.",
    messageForType: (phrase) =>
      `Bu ${phrase} için konum hangi ülke? Ülke, piyasa ve düzenleme değerlendirmesi için zorunludur.`,
    helper:
      "Çok ülkeli bir platformsa ana ülkeyi seçin. Diğerlerini İnceleme’de not edebilirsiniz.",
    restrictedWarning:
      "Bu coğrafya, bir rapor yayımlanmadan önce idari inceleme gerektirir.",
    restrictedAck: "Analizin inceleme için bekletilebileceğini anlıyorum.",
    allCountries: "Tüm ülkeler",
    searchPlaceholder: "Ada veya ISO koduna göre ara",
    emptyMessage: "Eşleşen ülke yok",
    minQueryMessage: "Aramak için en az 2 harf yazın",
  },
  q5: {
    title: "Konum ayrıntısı",
    message: (countryName) =>
      `${countryName} içinde konum ne kadar net? Kent veya bölge yardımcı olur; bu aşamada “henüz karar yok” kabul edilir.`,
    countryFallback: "seçilen ülke",
    cityLabel: "Kent veya saha alanı",
    regionLabel: "Bölge veya il",
    cityPlaceholder: "ör. Gaziantep",
    regionPlaceholder: "ör. Aşağı Silezya",
    helper: "2–60 karakter.",
  },
  q6: {
    title: "Gelişim aşaması",
    message:
      "Bu dosya gelişim döngüsünün neresinde? Aşama, eksik offtake, izin ve saha kontrolünü ne kadar sert okuyacağımı değiştirir.",
  },
  q7: {
    title: "Yatırım ölçeği",
    message:
      "Toplam sermaye ihtiyacı kabaca nedir? Aralık yeterlidir; bunu nokta tahmin olarak okumam.",
    currencyLabel: "Para birimi",
    otherLabel: "Diğer",
    notSureConfirm:
      "Ölçek bilinmiyor olarak kaydedildi. Finansal değerlendirme daha düşük güvenle yürür.",
  },
  q8: {
    title: "Bunu kim değerlendiriyor",
    message:
      "Bu değerlendirme kimin için? Görev testi ve önerinin tonu buna göre kurulur.",
  },
  q9: {
    title: "Çıktıyı kim alır",
    message:
      "Çıktıyı kimin alması bekleniyor? Talep yolu, gelirin kanıtlanıp kanıtlanmadığını belirler.",
    unknownConfirm:
      "Alıcı türü tanımsız kaydedildi. Talep yolu eksik sayılacak.",
  },
  q10: {
    title: "Talep kesinliği",
    message:
      "Talep bugün ne kadar sağlam? Bu, koşullu ilerleme ile erteleme arasında fark yaratabilir.",
    hypothesisConfirm:
      "Talep hipotez olarak kaydedildi. Bu temelde koşulsuz ilerleme verilmez.",
    buyerUndefinedWarning:
      "Alıcı türü hâlâ tanımsız. Devam edin veya geri dönün.",
  },
  q11: {
    title: "Saha / konum kontrolü",
    message:
      "Sahayı kontrol ediyor musunuz, yoksa konum hâlâ açık mı? Kontrolsüz saha, yeşil saha dosyalarında gecikmenin yaygın nedenidir.",
    assetLightMessage:
      "Bu faaliyet nereden yürüyecek? Dijital veya mobil bir hizmet için saha gerekmez seçeneği kabul edilir.",
    searchingConfirm:
      "Saha seçilmedi olarak kaydedildi. Yeşil saha veya bölge dosyasında bu genellikle koşul olur.",
  },
  q12: {
    title: "Gerekli karar",
    message:
      "Bu değerlendirme hangi kararı desteklemeli? Öneriyi genel bir rapor değil, bu soru etrafında kurarım.",
    stallHelper:
      "İlk evet/hayır gerekiyorsa Git / gitme’yi seçin. Ekibi görevlendirip görevlendirmeyeceğinize bakıyorsanız, ekip bağlamadan tarama’yı seçin.",
  },
  review: {
    title: "Yanıtlarınızı gözden geçirin",
    message:
      "Öneri üretmeden önce bu olguları doğrulayın. Her satırı açıp değiştirebilirsiniz. Eksik yanıt uydurmam.",
    incompleteError: "Bazı yanıtlar eksik. Düzeltmek için bir satır açın.",
    nextLabel: "Öneriyi gör",
    draftPersisted: "Taslak bu tarayıcıda, bu demo için kaydedildi.",
    groupOpportunity: "Fırsat",
    groupPlace: "Yer",
    groupScale: "Ölçek ve aşama",
    groupContext: "Bağlam",
    rowProjectContext: "Proje bağlamı",
    rowOpportunityType: "Fırsatın türü",
    rowSector: "Sektör",
    rowProduct: "Ne üretir",
    rowCountry: "Ülke",
    rowLocation: "Konum",
    rowStage: "Gelişim aşaması",
    rowCurrency: "Para birimi",
    rowCapital: "Sermaye aralığı",
    rowEvaluator: "Bunu kim değerlendiriyor",
    rowDecisionNeeded: "Gerekli karar",
    rowSite: "Saha kontrolü",
    scaleNotSet: "Ölçek belirtilmedi",
    confidencePreview: (band) => `Güven önizlemesi · ${band}`,
    confidenceLowOpen: (open) => `Güven düşük olacak. Hâlâ açık: ${open}.`,
    confidenceLowScale: "Güven düşük olacak. Sermaye ölçeği belirtilmedi.",
    confidenceHigh:
      "Güven yüksek olacak. Toplanan yanıtlarda yumuşak belirsizlik yok.",
    confidenceMedium: (open) => `Güven orta olacak. Hâlâ açık: ${open}.`,
    restrictedGeo:
      "Bu coğrafya, öneri yayımlanmadan önce inceleme gerektirir.",
    openCapital: "sermaye ölçeği",
    openBuyer: "alıcı türü",
    openDemand: "talep kesinliği",
    openSite: "saha kontrolü",
    openLocation: "konum",
    openSector: "sektör",
  },
  decision: {
    editLabel: "Yanıtları düzenle",
    policyLabel: "Ön tarama politikası v0.1",
    status:
      "Ön tarama · 12 / 12 soru · Öneri, kabul edilmedi",
    statusAccepted: "Ön tarama · 12 / 12 soru · Öneri kabul edildi",
    statusAmended: "Ön tarama · 12 / 12 soru · Öneri tadil edildi",
    statusRejected: "Ön tarama · 12 / 12 soru · Öneri reddedildi",
    publicationHeld: "Yayımlama inceleme için bekletildi",
    confidenceSuffix: "kanıt kalitesi",
    bankDisclaimer: "Bu bir kredi onayı değildir.",
    disclaimer:
      "Bu bir ön taramadır; fizibilite çalışması, yatırım tavsiyesi, bankable model veya hukuki/teknik due diligence değildir. Öneriyi kurallar üretti. Adı geçen bir kişi henüz kabul etmedi.",
    disclaimerRecorded:
      "Bu bir ön taramadır; fizibilite çalışması, yatırım tavsiyesi, bankable model veya hukuki/teknik due diligence değildir. Öneriyi kurallar üretti.",
    defect: "Öneri üretilemedi. İnceleme’ye dönün.",
    snapshotNote: "İnceleme’de doğrulanan yanıtlara dayanır.",
    snapshotPersisted:
      "Prototip: bu demo tek bir öneriyi yalnızca bu tarayıcıda saklar.",
    clearSaved: "Kayıtlı öneriyi sil",
    sectionDecision: "Karar",
    sectionConfidence: "Güven",
    sectionConditions: "Koşullar",
    sectionWhy: "Bu kararın gerekçesi",
    sectionNext: "Bundan sonra ne olmalı",
    sectionOpportunity: "Fırsat",
    bandHigh: "Yüksek",
    bandMedium: "Orta",
    bandLow: "Düşük",
    postureProceed: "Koşullu ilerle",
    postureDefer: "Ertele",
    deferPostureSentence:
      "Bu dosya karar için hazır değil. Aşağıdaki boşluklar kapanmadan, bu çerçevede ek zaman veya bütçe harcamayın.",
    of: "/",
    evaluator: {
      sectionLabel: "Değerlendirici kararı",
      helper:
        "Değerlendiricinin bu öneriyi nasıl ele aldığını kaydedin. Önerinin kendisi değişmez.",
      statusChoice: "Bu öneri için bir durum seçin.",
      accept: "Öneriyi kabul et",
      amend: "Öneriyi tadil et",
      reject: "Öneriyi reddet",
      accepted: "Değerlendirici öneriyi yazıldığı gibi kabul etti.",
      amended:
        "Değerlendirici öneriyi tadil etti. Önerinin kendisi değişmedi.",
      rejected:
        "Değerlendirici öneriyi reddetti. Önerinin kendisi değişmedi.",
      nameLabel: "Değerlendirici adı",
      nameHelper: "Bu öneriden sorumlu kişi veya masayı yazın.",
      namePlaceholder: "ör. Yatırım Masası",
      nameRequiredError:
        "Bu kararı kaydetmeden önce bir değerlendirici adı ekleyin.",
      reasonLabel: "Gerekçe",
      reasonHelper:
        "Öneri tadil veya reddedildiyse değerlendiricinin gerekçesini kaydedin.",
      recordedByPrefix: "Kaydeden",
      reasonPrefix: "Gerekçe:",
      amendReasonError:
        "Öneriyi tadil etmeden önce bir gerekçe ekleyin.",
      rejectReasonError:
        "Öneriyi reddetmeden önce bir gerekçe ekleyin.",
    },
  },
  validation: {
    selectOption: "Devam etmek için bir seçenek işaretleyin",
    sectorOther:
      "3–40 karakterlik bir sektör girin; harf, rakam, boşluk veya tire kullanın",
    productLength: "Çıktıyı 8–80 karakterle tanımlayın",
    productContact:
      "URL veya e-postayı kaldırın — bu bir bağlantı değil, ürün tanımı olmalı",
    country: "Listeden bir ülke seçin",
    restrictedAck:
      "Analizin inceleme için bekletilebileceğini onaylayın",
    locationText: "2–60 karakterlik bir kent veya bölge girin",
  },
  options: {
    projectContext: {
      private_investment: {
        label: "Özel sektör yatırımı",
        helper:
          "Bir şirket, yatırımcı veya sponsor ticari bir yatırım fırsatını değerlendiriyor.",
        examples:
          "Fabrika, enerji tesisi, otel, lojistik merkezi, işleme tesisi",
      },
      public_project: {
        label: "Kamu projesi",
        helper:
          "Bir belediye veya kamu kurumu, kamu yararına bir projeyi değerlendiriyor.",
        examples:
          "Altyapı, turizm alanı, sosyal tesis, kentsel hizmet, çevre projesi",
      },
      development_finance: {
        label: "Kalkınma finansmanı / hibe ön taraması",
        helper:
          "Bir hibe, kredi veya kalkınma kurumu, destek için projeyi tarıyor.",
        examples:
          "Kalkınma ajansı desteği, donör finansmanı, imtiyazlı kredi, AB programı",
      },
      not_sure: {
        label: "Henüz emin değilim",
        helper: "Standart tarama yolunu kullanın; sonra netleştirirsiniz.",
      },
    },
    opportunityType: {
      greenfield: {
        label: "Yeni yeşil saha projesi",
        helper: "Sıfırdan kurmak veya inşa etmek",
      },
      expansion: {
        label: "Mevcut faaliyetin genişlemesi",
        helper: "Kapasite, ürün hattı veya saha eklemek",
      },
      brownfield: {
        label: "Satın alma veya brownfield",
        helper: "Mevcut bir varlığı almak veya dönüştürmek",
      },
      zone: {
        label: "Bölge, park veya arazi platformu",
        helper: "Sanayi bölgesi, kampüs veya arazi geliştirme",
      },
      asset_light: {
        label: "Hizmet, dijital veya varlık-hafif",
        helper: "Sınırlı fiziksel tesis",
      },
      other: {
        label: "Diğer",
        helper: "Bunu standart bir proje taraması olarak ele alırım",
      },
    },
    locationSpecificity: {
      city_known: { label: "Kent veya saha alanı biliniyor" },
      region_known: { label: "Yalnızca bölge / il" },
      country_only: { label: "Yalnızca ülke — konum henüz kararlaştırılmadı" },
    },
    capexRange: {
      lt_5m: { label: "5 milyonun altında" },
      "5_25m": { label: "5–25 milyon" },
      "25_100m": { label: "25–100 milyon" },
      "100_500m": { label: "100–500 milyon" },
      gt_500m: { label: "500 milyonun üzerinde" },
      not_sure: { label: "Henüz emin değilim" },
    },
    evaluationContext: {
      consultant_client: {
        label: "Müşteriye danışmanlık yapan danışman",
        helper: "Müşteriye sunulabilir ön fizibilite",
      },
      ipa_inbound: {
        label: "Yatırımcıyı tarayan yatırım ajansı",
        helper: "Gelen talep / tanıtım yanıtı",
      },
      sponsor_own: {
        label: "Kendi projesini değerlendiren sponsor",
        helper: "İç git / gitme",
      },
      bank_screen: {
        label: "Banka veya kredi veren — erken tarama",
        helper: "Kredi / görev filtresi, tam model değil",
      },
      zone_developer: {
        label: "Bölge veya park geliştiricisi",
        helper: "Kiracı / arazi tahsisi uyumu",
      },
      public_agency: {
        label: "Kamu kurumu / kalkınma kuruluşu",
        helper: "Görev veya program uyumu",
      },
    },
    buyerTypePrivate: {
      b2b_contract: {
        label: "B2B — sözleşmeli (PPA, offtake, offtake niyet mektubu)",
      },
      b2b_spot: { label: "B2B — açık / spot piyasa" },
      b2c: { label: "B2C / perakende talep" },
      b2g: { label: "Kamu veya kamu alımı" },
      mixed: { label: "Karma kanallar" },
      unknown: { label: "Henüz tanımlı değil" },
    },
    buyerTypePublic: {
      b2b_contract: { label: "Anlaşması olan adlandırılmış kurumsal kullanıcılar" },
      b2b_spot: {
        label: "Kullanıcılar kullanım başına öder — tarife, bilet veya ücret",
      },
      b2c: { label: "Hane / genel kamu" },
      b2g: { label: "Ödeyen veya kullanıcı kamudur" },
      mixed: { label: "Karma kullanıcılar" },
      unknown: { label: "Henüz tanımlı değil" },
    },
    buyerTypeDevfin: {
      b2b_contract: {
        label: "Anlaşması olan adlandırılmış kullanıcılar veya offtaker’lar",
      },
      b2b_spot: { label: "Kullanıcılar kullanım başına öder — uzun sözleşme yok" },
      b2c: { label: "Hane / bireysel kullanıcılar" },
      b2g: { label: "Hükümet veya kamu kurumu" },
      mixed: { label: "Karma kullanıcılar" },
      unknown: { label: "Henüz tanımlı değil" },
    },
    demandCertaintyPrivate: {
      binding: {
        label: "Bağlayıcı sözleşme veya PPA",
        helper: "İmzalı, icra edilebilir",
      },
      loi: {
        label: "Niyet mektubu / term sheet / mutabakat",
        helper: "Bağlayıcı değil ama adı konmuş taraflar",
      },
      advanced: {
        label: "İleri görüşmeler",
        helper: "Adı konmuş alıcılar, kâğıt yok",
      },
      hypothesis: {
        label: "Yalnızca talep hipotezi",
        helper: "Adı konmuş alıcı yok",
      },
      not_applicable: {
        label: "Uygulanmaz",
        helper: "Offtake’siz merchant veya perakende",
      },
    },
    demandCertaintyPublic: {
      binding: {
        label:
          "Bağlayıcı taahhüt — sözleşme, tarife kararı, bütçe kalemi veya imzalı offtake",
      },
      loi: {
        label:
          "Yazılı ama bağlayıcı değil — mutabakat, niyet mektubu veya henüz finanse edilmemiş meclis kararı",
      },
      advanced: { label: "Adı konmuş kullanıcılar veya kurumlar, kâğıt yok" },
      hypothesis: {
        label: "İhtiyaç varsayılıyor; adı konmuş kullanıcı veya ödeyen yok",
      },
      not_applicable: {
        label: "Tasarım gereği kullanıcı ücreti veya offtake yok",
      },
    },
    siteControl: {
      secured: {
        label: "Saha güvence altında veya mülkiyette",
        helper: "Kontrol yerinde",
      },
      option: {
        label: "Opsiyon veya münhasır hak",
        helper: "Tam güvence yok",
      },
      searching: {
        label: "Hâlâ aranıyor / seçilmedi",
        helper: "Konum açık",
      },
      not_needed: {
        label: "Saha gerekmez",
        helper: "Dijital, mobil veya varlık-hafif",
      },
    },
    decisionNeeded: {
      go_nogo: {
        label: "Git / gitme",
        helper: "Daha fazla zaman harcanıp harcanmayacağı",
      },
      client_response: {
        label: "Müşteri veya gelen talep yanıtı",
        helper: "Şimdi ne söyleneceği",
      },
      mandate_screen: {
        label: "Ekip bağlamadan önce tarama",
        helper: "Çalışmaya kadro ayrılıp ayrılmayacağı",
      },
      compare: {
        label: "Seçenekleri karşılaştır",
        helper: "Mutlak duruş; sıralama bu taramanın dışında",
      },
      financing_read: {
        label: "Finansman hazırlığı",
        helper: "Bankable model değil",
      },
    },
    developmentStage: {
      concept: {
        label: "Konsept / fikir",
        helper: "Henüz resmi çalışma yok",
      },
      pre_feasibility: {
        label: "Ön fizibilite",
        helper: "Tarama; sınırlı çalışmalar",
      },
      feasibility: {
        label: "Fizibilite / izin",
        helper: "Çalışmalar veya izinler sürüyor",
      },
      ready_to_finance: {
        label: "Finansmana hazır",
        helper: "Sermaye veya kredi aranıyor",
      },
      construction: {
        label: "İnşaat veya devreye alma",
        helper: "Sermaye harcanıyor",
      },
      operating: {
        label: "İşletmede — genişleme veya gözden geçirme",
        helper: "Varlık mevcut",
      },
    },
  },
  opportunityTypeAck: {
    greenfield: "yeşil saha projesi",
    expansion: "mevcut faaliyetin genişlemesi",
    brownfield: "satın alma veya brownfield",
    zone: "bölge, park veya arazi platformu",
    asset_light: "hizmet veya varlık-hafif fırsat",
    other: "fırsat",
  },
  sectors: {
    energy: "Enerji",
    "energy.renewable": "Enerji — Yenilenebilir",
    "energy.renewable.solar": "Enerji — Güneş",
    "energy.renewable.wind": "Enerji — Rüzgar",
    "energy.storage": "Enerji — Depolama",
    "energy.oil_gas": "Enerji — Petrol ve gaz",
    manufacturing: "İmalat",
    "manufacturing.automotive": "İmalat — Otomotiv",
    "manufacturing.automotive.battery": "İmalat — Batarya hücreleri",
    "manufacturing.food": "İmalat — Gıda işleme",
    "manufacturing.textiles": "İmalat — Tekstil",
    "manufacturing.chemicals": "İmalat — Kimya",
    logistics: "Lojistik",
    "logistics.warehousing": "Lojistik — Depo / 3PL",
    "logistics.cold_storage": "Lojistik — Soğuk depo",
    "logistics.port": "Lojistik — Liman / terminal",
    agriculture: "Tarım ve gıda",
    "agriculture.processing": "Tarım — İşleme",
    tourism: "Turizm ve konaklama",
    "tourism.hotel": "Turizm — Otel",
    "tourism.resort": "Turizm — Resort",
    real_estate: "Gayrimenkul",
    "real_estate.industrial": "Gayrimenkul — Endüstriyel",
    "real_estate.hospitality": "Gayrimenkul — Konaklama",
    healthcare: "Sağlık",
    "healthcare.hospital": "Sağlık — Hastane",
    "healthcare.pharma": "Sağlık — İlaç",
    technology: "Teknoloji",
    "technology.software": "Teknoloji — Yazılım / dijital",
    "technology.data_center": "Teknoloji — Veri merkezi",
    infrastructure: "Altyapı",
    "infrastructure.transport": "Altyapı — Ulaşım",
    "infrastructure.water": "Altyapı — Su",
    other: "Diğer",
  },
  productChips: {
    energy: [
      { value: "Solar PV", label: "Güneş PV" },
      { value: "Wind", label: "Rüzgar" },
      { value: "Battery storage", label: "Batarya depolama" },
      { value: "C&I power", label: "Ticari ve endüstriyel elektrik" },
    ],
    manufacturing: [
      { value: "Automotive components", label: "Otomotiv parçaları" },
      { value: "Food processing", label: "Gıda işleme" },
      { value: "Textiles", label: "Tekstil" },
      { value: "Chemicals", label: "Kimyasallar" },
    ],
    logistics: [
      { value: "Cold storage", label: "Soğuk depo" },
      { value: "Warehouse / 3PL", label: "Depo / 3PL" },
      { value: "Port / terminal", label: "Liman / terminal" },
    ],
    tourism: [
      { value: "Hotel", label: "Otel" },
      { value: "Resort", label: "Resort" },
      { value: "Mixed-use hospitality", label: "Karma kullanımlı konaklama" },
    ],
  },
  context: {
    q9: {
      publicTitle: "Kim kullanır veya öder",
      publicMessage:
        "Bunu kimin kullanması veya ödemesi bekleniyor? Tanımsızsa öyle deyin. Kullanıcı uydurmam.",
      devfinTitle: "Kullanıcı veya offtaker kim",
      devfinMessage:
        "Desteklenen faaliyetin çıktısını kimin kullanması veya ödemesi bekleniyor? Tanımsız bırakılabilir; güven düşer.",
    },
    q10: {
      publicTitle: "Kullanım veya ödeme ne kadar sağlam",
      publicMessage:
        "Talep veya kamusal kullanım bugün ne kadar kanıtlı? Adı konmamış kullanıcıyla kamu malı bir hipotezdir; atlanacak bir soru değildir.",
      devfinTitle: "Talep veya kullanım kanıtı",
      devfinMessage:
        "Talep veya kullanım bugün ne kadar sağlam? Hibe taraması yine de bunu ister. Konsept notunu kanıt saymam.",
    },
    reviewSiteGroup: {
      private: "Ticari yapı ve saha",
      public: "Kullanım, kanıt ve saha",
      development_finance: "Kullanım, kanıt ve destek hazırlığı",
    },
    offtakePublic:
      "Kamusal kullanım veya ödeme kanıtlanmadı. Kullanıcıyı veya ödeyeni adlandırın; ya da talebin hâlâ hipotez olduğunu kabul edin.",
    grantDisclaimer:
      "Bu bir uygunluk görüşü, hibe tahsisi veya ödeme taahhüdü değildir.",
    conditionsIntro: {
      defer: "Yeni bir öneri için bunların kapanması gerekir.",
      private: "Daha fazla kaynak harcamadan önce bunları kabul edin.",
      public:
        "Daha fazla kamu zamanı veya bütçesi bağlamadan önce bunları kabul edin.",
      development_finance:
        "Bu dosyayı değerlendirme veya destek hazırlığına almadan önce bunları kabul edin.",
    },
    emptyFallback: {
      private:
        "Ek kanıt koşulu tetiklenmedi. Bu prototip yine de koşulsuz ilerleme vermez.",
      public:
        "Ek kamusal-kanıt koşulu tetiklenmedi. Bunu koşullu bir tarama sayın; kamu kaynağı bağlama yetkisi değil.",
      development_finance:
        "Ek değerlendirme koşulu tetiklenmedi. Bunu koşullu bir tarama sayın; uygunluk görüşü veya finansman taahhüdü değil.",
    },
    nextCommission: {
      private: "Bu öneriye dayanarak fizibilite çalışması sipariş etmeyin.",
      public:
        "Yalnızca bu öneriye dayanarak çalışma sipariş etmeyin veya kamu kaynağı bağlamayın.",
      development_finance:
        "Bunu uygunluk kararı, tahsis kararı veya finansman taahhüdü saymayın.",
    },
    proceedWhy: {
      private:
        "Dosyanın tarama için kullanılabilir bir biçimi var; ancak yalnızca koşullar kabul edilirse.",
      public:
        "Projenin ilk kamu-projesi taraması için kullanılabilir bir biçimi var; ancak yalnızca koşullar kabul edilirse.",
      development_finance:
        "Dosyanın ilk destek taraması için kullanılabilir bir biçimi var; ancak yalnızca koşullar kabul edilirse.",
    },
    proceedPosture: {
      private:
        "Yalnızca aşağıdaki koşullar kabul edilirse ilerleyin. Bu, tam bir çalışma sipariş etme izni değildir.",
      public:
        "Yalnızca aşağıdaki koşullar kabul edilirse ilerleyin. Bu, kamu kaynağı bağlama veya çalışma başlatma izni değildir.",
      development_finance:
        "Yalnızca aşağıdaki koşullar kabul edilirse ilerleyin. Bu, değerlendirmeye alma, destek onaylama veya finansman taahhüt etme izni değildir.",
    },
  },
  card: {
    offtakeUnknown:
      "Çıktıyı kimin alacağını tanımlayın, ardından bu talebi kanıtlayın.",
    offtakeHypothesis:
      "Talep hâlâ bir hipotez. Geliri gerçek saymadan önce adı konmuş bir alıcı yolu kanıtlayın.",
    offtakeAdvanced:
      "Talep görüşmede, kâğıtta değil. Offtake’i kanıt saymadan önce bunu mektuba veya sözleşmeye dönüştürün.",
    condSite:
      "Saha hâlâ aranıyor. Bunu inşaya hazır bir dosya saymadan önce kontrolü güvenceye alın.",
    condScale:
      "Sermaye ihtiyacını bir aralığa bağlayın. “Emin değilim” bir ölçek değildir.",
    condGeo:
      "Bu coğrafya, herhangi bir rapor yayımlanmadan önce uyum incelemesi gerektirir.",
    whyBuyerMega:
      "100 milyon ve üzerinde alıcı türü tanımsız. Bu, krediye veya çalışmaya hazır bir dosya değildir.",
    whyConceptMega: "Bu ölçekte bir konsept, çalışma için hazır değildir.",
    whyTripleThin:
      "Konsept, belirsiz konum ve açık bir ticari veya ölçek boşluğu. Dosya karar için fazla ince.",
    whyDemandMega:
      "100 milyon ve üzerinde talep bir hipotez. Bu, çalışmaya hazır bir dosya değildir.",
    whyBankHyp:
      "Bir banka erken taraması, hipotez talebi krediye hazır sayamaz.",
    whyFinanceRead:
      "Finansman okuması kâğıt üzerindeki talebi ister. Bu, bankable bir finansal model değildir.",
    whyConfThin: "Kanıt kalitesi ilerlemeyi önermek için çok düşük.",
    whyCompare:
      "Bu, bu dosya için mutlak bir duruştur. Diğer seçeneklere karşı sıralama bu taramanın dışındadır.",
    whyNotBankable: "Bu, bankable bir finansal model değildir.",
    whyExportBlocked:
      "Coğrafya duruşu değiştirmez. İnceleme bitene kadar yayımlamayı engeller.",
    whyMandate:
      "Bu fırsat, onu değerlendiren masanın göreviyle örtüşmüyor.",
    nextIfConditions:
      "Koşullar kabul edilemiyorsa durun. “Dikkatle ilerleyin” demeyin.",
    nextNoUnconditional: "Bu tarama koşulsuz ilerleme vermez.",
    nextDeferClose:
      "Koşullar’da adlandırılan boşlukları kapatın. Yalnızca bu yanıtlar oluştuktan sonra yeniden çalıştırın.",
    nextDeferStaff:
      "Karar alınmış gibi dosyaya kadro ayırmayın, kredi masası açmayın veya yatırım ajansı tanıtım yanıtı yazmayın.",
    nextExport:
      "Uyum incelemesi tamamlanmadan bu öneriyi dışa aktarmayın veya göndermeyin.",
  },
  drivers: {
    "Capital scale is unknown.": "Sermaye ölçeği bilinmiyor.",
    "Buyer type is undefined.": "Alıcı türü tanımsız.",
    "Demand is a hypothesis.": "Talep bir hipotez.",
    "Location is country-only.": "Konum yalnızca ülke düzeyinde.",
    "Site is not selected.": "Saha seçilmedi.",
    "Sector is unspecified (Other).": "Sektör belirtilmedi (Diğer).",
    "Restricted geography caps confidence.":
      "Kısıtlı coğrafya güveni tavanlar.",
    "Confidence is evidence quality, not attractiveness.":
      "Güven, çekicilik değil kanıt kalitesidir.",
    "Collected answers contain no soft unknowns.":
      "Toplanan yanıtlarda yumuşak belirsizlik yok.",
  },
};
