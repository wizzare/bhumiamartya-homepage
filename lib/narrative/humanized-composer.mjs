// Canonical Humanized Narrative Composer for Bhumi Amartya
// Transforms structured calculation facts into natural, warm, and flowing Indonesian prose.
// Strictly avoids robotic AI templates, hyperbolic mysticism, and deterministic claims.

const LIFE_PATH_PROFILES = {
  1: {
    core: 'inisiatif mandiri dan keberanian membuka langkah pertama',
    strength: 'tidak mudah ragu saat harus memulai sesuatu yang baru, terutama ketika situasi menuntut arah yang jelas',
    blindspot: 'terlalu cepat merasa harus memikul semuanya sendirian tanpa memberi kesempatan orang lain untuk terlibat',
    learning: 'belajar bahwa menjadi mandiri bukan berarti harus selalu berjalan sendiri',
    work: 'cenderung bersemangat ketika memiliki keleluasaan untuk memimpin inisiatif dan menentukan ritme kerjamu',
    closing: 'Mungkin tidak semua jalan harus kamu selesaikan dalam satu tarikan napas. Kadang, keberanian terbesar justru ada pada kesediaan untuk membagi beban dan melangkah perlahan.'
  },
  2: {
    core: 'kepekaan rasa, diplomasi, dan kemampuan merajut kerja sama',
    strength: 'kepekaan alami untuk menangkap suasana hati orang di sekitarmu dan menjaga keharmonisan kelompok',
    blindspot: 'kecenderungan menunda menyampaikan isi hati karena khawatir merusak suasana atau mengecewakan orang lain',
    learning: 'belajar bahwa kejujuran yang disampaikan dengan tenang adalah bentuk cinta dan kepedulian yang paling nyata',
    work: 'bekerja paling nyaman di lingkungan yang saling mendukung dan menghargai dialog dua arah',
    closing: 'Menjaga perasaan orang lain adalah kebaikan yang berharga, tapi pastikan kamu juga menyediakan ruang aman yang sama hangatnya untuk dirimu sendiri.'
  },
  3: {
    core: 'ekspresi kreatif, komunikasi yang hidup, dan kelincahan ide',
    strength: 'kemampuan melihat sisi cerah dari keadaan dan menyalurkan gagasan melalui kata atau karya dengan spontan',
    blindspot: 'perhatian yang mudah terbagi ketika terlalu banyak hal menarik datang bersamaan, sehingga hal-hal penting terhenti di tengah jalan',
    learning: 'belajar memberi batas pada ide-ide baru agar apa yang sudah kamu mulai bisa selesai dengan utuh',
    work: 'membutuhkan ruang untuk bereksplorasi dan tidak terlalu terkekang oleh aturan yang kaku tanpa alasan jelas',
    closing: 'Gagasanmu indah saat dibagikan, tapi akan jauh lebih bermakna ketika kamu memberi waktu bagi satu ide sederhana untuk benar-benar berakar dan tumbuh.'
  },
  4: {
    core: 'ketekunan, struktur yang kokoh, dan tanggung jawab praktis',
    strength: 'keandalan dalam menjaga komitmen, menata proses, dan memastikan fondasi hidup tetap stabil',
    blindspot: 'kecemasan yang muncul ketika rencana berubah mendadak di luar kendalimu, sehingga kamu cenderung bertahan terlalu kaku',
    learning: 'belajar membedakan antara menjaga kestabilan dan bersikap fleksibel saat keadaan memang membutuhkan penyesuaian',
    work: 'unggul dalam hal-hal yang membutuhkan keteraturan, metode jelas, dan konsistensi jangka panjang',
    closing: 'Fondasi yang kuat memang penting, tapi jangan lupa memberi sedikit ruang longgar bagi hal-hal baik yang datang tanpa rencana.'
  },
  5: {
    core: 'jiwa petualang, adaptabilitas tinggi, dan kebebasan bereksplorasi',
    strength: 'kemampuan beradaptasi dengan cepat di lingkungan baru serta keterbukaan pada pengalaman yang beragam',
    blindspot: 'rasa gelisah yang cepat muncul saat rutinitas terasa monoton, yang kadang membuatmu ingin berpindah sebelum hal tersebut matang',
    learning: 'belajar menemukan kebebasan di dalam komitmen yang kamu pilih sendiri, bukan melulu dengan cara lari dari batasan',
    work: 'paling hidup di peran yang dinamis, tidak monoton, dan memberi ruang gerak yang leluasa',
    closing: 'Dunia selalu menawarkan hal baru yang menggoda. Namun kedalaman sering kali baru terasa saat kamu bersedia tinggal sedikit lebih lama di satu tempat.'
  },
  6: {
    core: 'tanggung jawab merawat, welas asih, dan menjaga keharmonisan orang terdekat',
    strength: 'kemampuan hadir sebagai tempat bersandar yang hangat dan kepedulian tulus terhadap kesejahteraan keluarga serta sahabat',
    blindspot: 'dorongan untuk memperbaiki masalah semua orang sampai lupa bahwa setiap orang punya proses belajarnya masing-masing',
    learning: 'belajar merawat tanpa mengorbankan batas kesehatan batin dan fisikmu sendiri',
    work: 'berkembang di lingkungan yang bernilai sosial, mementingkan etika, dan memberi dampak nyata bagi orang lain',
    closing: 'Kasih yang paling sehat adalah kasih yang tidak menuntutmu untuk terus kehabisan napas demi menyenangkan semua pihak.'
  },
  7: {
    core: 'pencarian makna batin, ketajaman analisis, dan kedalaman berpikir',
    strength: 'kemampuan mengamati apa yang ada di balik permukaan dan tidak mudah puas dengan jawaban yang dangkal',
    blindspot: 'terlalu banyak menarik diri ke dalam kepala sendiri hingga terasa berjarak dari lingkungan sosial',
    learning: 'belajar mempercayai rasa dan membiarkan orang lain mengenal sisi rentanmu, bukan hanya pikiranmu',
    work: 'bekerja paling jernih saat diberi waktu hening untuk meneliti, merenung, dan memecahkan persoalan yang kompleks',
    closing: 'Mencari jawaban ke dalam diri adalah anugerah yang tenang. Luangkan pula waktu untuk sesekali duduk bersama orang terdekat dan menikmati obrolan biasa tanpa perlu membedah maknanya.'
  },
  8: {
    core: 'daya kelola, ketegasan memimpin, dan orientasi pada dampak nyata',
    strength: 'keberanian mengambil keputusan praktis, mengelola sumber daya, dan membangun sistem yang berdampak besar',
    blindspot: 'dorongan untuk selalu memegang kendali penuh, yang bisa membuatmu mudah tegang saat hasil tidak sesuai standar tinggimu',
    learning: 'belajar bahwa kepemimpinan yang bijak lahir dari kerendahan hati dan kesabaran mendampingi proses orang lain',
    work: 'nyaman memegang tanggung jawab terukur, mengarahkan tujuan, dan melihat pencapaian nyata dari kerja kerasmu',
    closing: 'Pencapaian luar biasa terasa lebih manis ketika dibangun di atas tubuh yang cukup istirahat dan hati yang tidak terbebani rasa harus selalu menang.'
  },
  9: {
    core: 'pandangan luas, welas asih kemanusiaan, dan keikhlasan melepaskan',
    strength: 'kemampuan melihat gambaran besar kehidupan dan empati yang tulus pada mereka yang membutuhkan dukungan',
    blindspot: 'sering kali menyimpan kekecewaan dalam diam ketika kenyataan dunia tidak seindah idealisme yang ada di pikiranmu',
    learning: 'belajar merangkul ketidaksempurnaan dunia dan menerima bahwa melepaskan hal-hal yang selesai adalah bagian dari pembaruan hidup',
    work: 'terpanggil pada bidang-bidang yang membawa manfaat sosial, pendidikan, atau karya yang menginspirasi',
    closing: 'Kamu tidak perlu membenahi seluruh dunia hari ini. Cukup rawat apa yang ada di hadapanmu dengan ketulusan yang sama.'
  },
  11: {
    core: 'intuisi yang peka dan inspirasi praktis untuk sesama',
    strength: 'ketajaman naluri yang bisa menangkap getaran rasa sebelum kata-kata terucap',
    blindspot: 'kepekaan yang berlebihan terhadap energi lingkungan sehingga mudah merasa lelah tanpa alasan yang jelas',
    learning: 'belajar menyaring informasi batin dan membumikan wawasan ke dalam kebiasaan hidup sehari-hari',
    work: 'cocok di peran yang menghubungkan orang, membimbing, atau menuangkan inspirasi ke media kreatif',
    closing: 'Kepekaan batinmu adalah kompas yang lembut. Jagalah dengan tidur yang cukup, waktu jeda, dan kebiasaan sederhana yang menenangkan.'
  },
  22: {
    core: 'pembangunan visi jangka panjang yang berpijak di bumi',
    strength: 'perpaduan antara impian besar dan ketangguhan praktis untuk mewujudkannya batu demi batu',
    blindspot: 'beban ekspektasi yang terlalu berat pada diri sendiri karena merasa harus selalu menghasilkan karya besar',
    learning: 'belajar menikmati langkah-langkah kecil tanpa terus terburu-buru mengejar hasil akhir',
    work: 'unggul dalam merancang proyek jangka panjang, tata kelola, dan arsitektur gagasan',
    closing: 'Karya besar dibangun dari hari-hari biasa yang dijalani dengan setia. Jangan abaikan kebahagiaan sederhana di sepanjang perjalananmu.'
  },
  33: {
    core: 'pelayanan penuh kasih dan keteladanan yang meneduhkan',
    strength: 'kehadiran yang menenangkan dan kerelaan mendengarkan tanpa menghakimi',
    blindspot: 'mudah merasa bersalah saat harus beristirahat atau berkata "tidak" pada permintaan orang lain',
    learning: 'belajar bahwa menjaga batas diri adalah bagian penting agar kamu bisa terus melayani dengan sehat',
    work: 'berkembang di bidang pengasuhan, pendampingan, konseling, dan karya kemanusiaan',
    closing: 'Bahkan lilin yang paling terang pun butuh tempat berteduh agar apinya tidak padam oleh angin. Rawatlah dirimu terlebih dahulu.'
  }
};

const ARCANA_PROFILES = {
  'The Magician': 'daya kreasi dan inisiatif untuk mewujudkan gagasan menjadi tindakan nyata',
  'The High Priestess': 'intuisi yang tenang dan kebiasaan mendengarkan bisikan batin sebelum memutuskan',
  'The Empress': 'kehangatan merawat, kreativitas yang subur, dan penghargaan pada proses pertumbuhan alami',
  'The Emperor': 'ketegasan menata, kepemimpinan yang terstruktur, dan perlindungan pada orang-orang sekitar',
  'The Hierophant': 'pencarian nilai luhur, etika, dan pembelajaran dari kearifan tradisi',
  'The Lovers': 'kepekaan pada pilihan hati, keselarasan nilai, dan komunikasi yang terbuka',
  'The Chariot': 'fokus yang teguh, disiplin arah, dan tekad mengatasi rintangan dengan kepala dingin',
  'Justice': 'kejujuran menimbang, keadilan, dan kesadaran akan sebab-akibat dari setiap pilihan',
  'The Hermit': 'kebijaksanaan hening, kemampuan berefleksi mendalam, dan keberanian menatap diri sendiri',
  'Wheel of Fortune': 'keluwesan menerima dinamika pasang surut kehidupan dengan lapang dada',
  'Strength': 'kelembutan yang teguh dan kemampuan mengelola emosi tanpa perlu bersikap keras',
  'The Hanged Man': 'kerelaan melihat keadaan dari sudut pandang baru dan kesabaran menunggu waktu yang tepat',
  'Death': 'keberanian melepaskan hal-hal yang telah usai untuk membuka ruang bagi babak baru',
  'Temperance': 'seni menjaga keseimbangan, kesabaran memadukan perbedaan, dan ketenangan batin',
  'The Devil': 'kepekaan menyadari keterikatan emosi dan keberanian membebaskan diri dari pola yang mengikat',
  'The Tower': 'kemampuan bangkit dari perubahan mendadak dan membangun kembali fondasi yang lebih jujur',
  'The Star': 'harapan yang jernih, ketulusan rasa, dan keyakinan tenang pada arah masa depan',
  'The Moon': 'imajinasi yang dalam, kepekaan terhadap rasa yang tak terucapkan, dan kesadaran batin',
  'The Sun': 'kejujuran berekspresi, rasa syukur yang hangat, dan optimisme yang membumi',
  'Judgement': 'panggilan untuk jujur pada diri sendiri dan menyambut babak kedewasaan yang lebih utuh',
  'The World': 'kemampuan menyelesaikan apa yang telah dimulai dan merasakan keutuhan dalam diri',
  'The Fool': 'keterbukaan pada pengalaman baru dengan hati yang ringan dan tanpa prasangka'
};

const HUMAN_DESIGN_NARRATIVES = {
  Generator: {
    energyPattern: 'Energimu bekerja paling nyaman saat merespons hal-hal di sekitarmu, bukan saat memaksakan sesuatu terjadi dari ruang hampa. Ketika ada hal yang benar-benar memanggil minatmu, tenagamu bisa bertahan lama. Namun saat kamu memaksakan diri pada hal yang terasa menguras, tubuhmu biasanya mengirim sinyal lelah lebih cepat.',
    decisionStyle: 'Dengarkan respon spontan dari tubuhmu—apakah ada rasa tertarik yang hangat atau justru penolakan hening. Jangan buru-buru menjawab hanya karena sungkan.',
    restTip: 'Lakukan aktivitas yang kamu cintai hingga tuntas, lalu beristirahatlah saat energi tubuhmu memang sudah puas terpakai.'
  },
  'Manifesting Generator': {
    energyPattern: 'Kamu memiliki ritme yang lincah dan sering kali bisa mengerjakan beberapa minat sekaligus. Kadang orang lain merasa langkahmu terlalu cepat berpindah, padahal bagi dirimu, mencoba dan merasakan langsung adalah caramu belajar.',
    decisionStyle: 'Sebelum melangkah cepat, beri tahu orang terdekat tentang apa yang akan kamu lakukan. Komunikasi singkat ini akan menghindarkanmu dari gesekan yang tidak perlu.',
    restTip: 'Beri ruang bagi dirimu untuk berhenti dari hal yang sudah tidak lagi sesuai tanpa harus merasa bersalah.'
  },
  Projector: {
    energyPattern: 'Kekuatanmu bukan pada stamina kerja tanpa henti, melainkan pada ketajaman melihat pola, mengarahkan, dan membaca dinamika orang lain. Kamu sering tahu cara paling efektif untuk menyelesaikan sesuatu sebelum orang lain menyadarinya.',
    decisionStyle: 'Pandanganmu paling bernilai saat diminta atau dihargai. Kamu tidak perlu membuktikan diri dengan terus-menerus bekerja keras melebihi kapasitas fisikmu.',
    restTip: 'Istirahat dan waktu hening bukan bentuk kemalasan bagimu, melainkan cara menjaga kejernihan pandanganmu tetap tajam.'
  },
  Manifestor: {
    energyPattern: 'Ada dorongan alami dalam dirimu untuk memulai dan membuka jalan baru tanpa perlu menunggu persetujuan orang lain. Kamu paling nyaman ketika memiliki ruang kebebasan untuk bertindak.',
    decisionStyle: 'Tantangan terbesarmu biasanya ada pada komunikasi: memberi kabar singkat kepada orang di sekitarmu sebelum bertindak akan membuat langkahmu jauh lebih lancar dan minim penolakan.',
    restTip: 'Saat dorongan bertindak sedang jeda, jangan memaksakan diri. Gunakan masa tenang untuk memulihkan tenaga batinmu.'
  },
  Reflector: {
    energyPattern: 'Kamu memiliki keterbukaan yang sangat peka terhadap lingkungan di sekitarmu. Seperti cermin yang tenang, kamu bisa merasakan apakah sebuah tempat atau kelompok terasa sehat atau tidak.',
    decisionStyle: 'Jangan terburu-buru mengambil keputusan penting dalam hitungan jam. Beri dirimu waktu beberapa hari atau satu siklus Bulan penuh untuk merasakan stabilitas rasa.',
    restTip: 'Pilihlah lingkungan dan orang-orang yang membuatmu merasa aman dan tidak dipaksa menjadi orang lain.'
  }
};

/**
 * Compose a natural, flowing, humanized reading based on calculated facts
 *
 * @param {object} params
 * @param {string} params.nickname - Name of user
 * @param {number} params.lifePath - Calculated Life Path number (1-9, 11, 22, 33)
 * @param {string} params.arcanaName - Calculated Arcana Center name
 * @param {string} params.sunSign - Natal Sun sign
 * @param {string} [params.weton] - Calculated Weton
 * @param {string} [params.baziElement] - BaZi Day Master element
 * @param {object} [params.humanDesign] - HD calculation output { type, profile, authority, strategy }
 * @param {object} [params.vedic] - Vedic calculation output { rashi, nakshatra, pada, nakshatraLord, currentMahadasha }
 * @param {object} [params.currentSky] - Canonical current sky calculation
 * @param {object} [params.personalTransits] - Canonical personal transit calculation
 * @param {boolean} [params.isPartial=false] - Whether birth time was provided
 * @returns {object} Structured humanized reading sections
 */
export function composeHumanizedReading({
  nickname,
  lifePath,
  arcanaName,
  sunSign,
  weton,
  baziElement,
  humanDesign,
  vedic,
  currentSky,
  personalTransits,
  isPartial = false
}) {
  const safeName = (nickname || 'Kawan').trim();
  const lpData = LIFE_PATH_PROFILES[lifePath] || LIFE_PATH_PROFILES[9];
  const arcanaDesc = ARCANA_PROFILES[arcanaName] || 'kepekaan membaca arah batin dan nilai hidup';
  const hdType = humanDesign?.type;
  const hdData = hdType && HUMAN_DESIGN_NARRATIVES[hdType] ? HUMAN_DESIGN_NARRATIVES[hdType] : null;

  // ==========================================
  // SECTION A: SAPAAN PERSONAL
  // ==========================================
  const greetingTitle = `Halo, ${safeName}. Yuk, kenali sedikit lebih dalam tentang dirimu.`;
  const greetingIntro = `Setiap orang membawa ritme dan kecenderungannya masing-masing dalam memandang dunia. Dari data lahirmu, tampak perpaduan menarik antara kualitas ${lpData.core} dan ${arcanaDesc}. Pola ini bukan ramalan kaku, melainkan cermin tenang untuk memahami caramu bergerak, memilih, dan pulang ke diri sendiri.`;

  // ==========================================
  // SECTION B: MENGENAL POLA DIRIMU
  // ==========================================
  let patternTendency = `Dalam keseharian, ada bagian dari dirimu yang memiliki ${lpData.strength}. Ketika menghadapi situasi yang baru atau tidak menentu, kamu cenderung mencari pijakan yang jelas sebelum melangkah.`;
  if (weton) {
    patternTendency += ` Ditambah dengan kepekaan rasa dari weton ${weton}, ada naluri alami untuk menjaga harmoni tanpa harus kehilangan arah pribadimu.`;
  }

  let patternResponse = '';
  if (hdData) {
    patternResponse = hdData.energyPattern;
  } else {
    patternResponse = `Ketika berhadapan dengan banyak pilihan atau situasi yang menuntut, caramu merespons biasanya sangat dipengaruhi oleh rasa kenyamanan batin. Bila pikiran terasa terlalu bising, memberi jeda sejenak untuk menarik napas sering kali lebih membantu daripada langsung memaksakan keputusan di tempat.`;
  }

  const patternBlindspot = `Di sisi lain, hal yang mungkin sesekali perlu kamu sadari adalah ${lpData.blindspot}. Ini wajar terjadi ketika kamu merasa peduli pada hasil, tapi menyadari pola ini sejak awal bisa membantumu tidak cepat merasa lelah.`;

  // ==========================================
  // SECTION C: HAL YANG MUNGKIN SEDANG KAMU PELAJARI
  // ==========================================
  let learningTheme = `Berdasarkan perpaduan pola ini, kamu mungkin sedang belajar ${lpData.learning}.`;
  if (vedic && vedic.nakshatra) {
    learningTheme += ` Di bawah naungan energi Nakshatra ${vedic.nakshatra}, ada dorongan batin untuk menyelaraskan antara apa yang kamu inginkan di dalam hati dan tindakan nyata yang kamu ambil sehari-hari.`;
  }
  learningTheme += ` Proses belajar ini jarang sekali terjadi secara instan. Bentuknya sering kali hadir lewat hal-hal kecil: kapan saatnya kamu berbicara jujur, kapan saatnya mendengarkan, dan kapan saatnya melepaskan hal-hal yang memang tidak bisa kamu kendalikan.`;

  // ==========================================
  // SECTION D: HUBUNGAN, AKTIVITAS, DAN KESEHARIAN
  // ==========================================
  const dailyLife = {
    communication: {
      title: 'Komunikasi dan Relasi',
      text: `Dalam berhubungan dengan orang lain, kamu cenderung menghargai keterbukaan yang tidak dibuat-buat. Hubunganmu terasa paling bertumbuh saat ada ruang aman untuk saling mendengar tanpa tergesa-gesa menilai atau memberi nasihat yang tidak diminta.`
    },
    decisionMaking: {
      title: 'Pengambilan Keputusan & Ritme Kerja',
      text: hdData
        ? `${hdData.decisionStyle} ${lpData.work}.`
        : `Dalam bekerja atau berkarya, ${lpData.work}. Memilih satu atau dua fokus yang benar-benar bisa kamu selesaikan hari ini akan terasa jauh lebih melegakan daripada memikirkan seluruh rencana sekaligus.`
    },
    energyAndRest: {
      title: 'Pengelolaan Energi & Istirahat',
      text: hdData
        ? hdData.restTip
        : `Tubuhmu biasanya memberi sinyal cukup jelas ketika sudah mencapai batas lelah. Luangkan waktu untuk istirahat yang benar-benar hening—bukan sekadar berpindah menatap layar lain—agar energimu kembali segar secara alami.`
    }
  };

  // ==========================================
  // SECTION E: LANGIT SAAT INI & REFLEKSI TRANSIT
  // ==========================================
  let skySection = null;
  if (currentSky) {
    const calculationDateFormatted = new Date(currentSky.calculationTime).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Moon narrative
    const currentMoonRashi = currentSky.moon.rashi.name;
    const currentMoonNak = currentSky.moon.nakshatra.name;
    const moonReflection = `Hari ini Bulan sidereal berada di rashi ${currentMoonRashi}, dinaungi Nakshatra ${currentMoonNak} (Pada ${currentSky.moon.nakshatra.pada}). Suasana langit ini secara simbolis menghadirkan nuansa yang mengundang kita menyelaraskan ritme pikiran dan memperhatikan apa yang sedang terasa paling penting saat ini.`;

    // Retrogrades narrative
    const retrogrades = currentSky.activeRetrogrades || [];
    let retrogradeNarrative = '';
    if (retrogrades.length > 0) {
      const retNames = retrogrades.map((r) => `${r.indonesianName} di ${r.rashi.name}`).join(', ');
      retrogradeNarrative = `Saat ini ada ${retrogrades.length} planet yang sedang berada dalam fase gerak mundur semu (retrograde): ${retNames}. Dalam tradisi astrologi reflektif, masa retrograde bukanlah pertanda hal buruk, melainkan pengingat ramah untuk meninjau kembali keputusan, memeriksa ulang percakapan, dan tidak terburu-buru menyimpulkan sesuatu yang masih berkembang.`;
    } else {
      retrogradeNarrative = `Saat ini seluruh planet utama bergerak maju (direct). Kondisi ini secara simbolis mendukung kelancaran komunikasi dan keberanian untuk menjalankan rencana-rencana yang sebelumnya telah kamu pertimbangkan secara matang.`;
    }

    // Top personal transits
    const primaryTransits = personalTransits?.primaryTransits || [];
    const transitReflections = primaryTransits.map((t) => ({
      planet: t.indonesianName,
      title: t.title,
      tag: t.tag,
      reflection: t.reflection
    }));

    // Limitation notice if birth time was not provided
    let precisionNote = '';
    if (isPartial) {
      precisionNote = 'Catatan: Karena jam atau kota lahir tidak dicantumkan secara lengkap, posisi Ascendant (Lagna) dan rumah astrologi tidak dihitung secara spekulatif. Refleksi transit di atas difokuskan pada relasi langit saat ini dengan posisi Matahari kelahiranmu.';
    }

    skySection = {
      title: 'Langit Saat Ini, dan Apa yang Bisa Kamu Renungkan',
      calculationDate: calculationDateFormatted,
      calculationTimeIso: currentSky.calculationTime,
      moonReflection,
      currentMoon: {
        rashi: currentMoonRashi,
        nakshatra: currentMoonNak,
        pada: currentSky.moon.nakshatra.pada
      },
      retrogradeNarrative,
      activeRetrogrades: retrogrades.map((r) => ({
        name: r.indonesianName,
        rashi: r.rashi.name,
        startDate: r.retrogradeWindow?.startDate || null,
        endDate: r.retrogradeWindow?.endDate || null
      })),
      transits: transitReflections,
      precisionNote
    };
  }

  // ==========================================
  // SECTION F: PESAN UNTUK DIRIMU SAAT INI
  // ==========================================
  const closingMessage = lpData.closing;

  return {
    nickname: safeName,
    sections: {
      greeting: {
        title: greetingTitle,
        intro: greetingIntro
      },
      patterns: {
        title: 'Mengenal Pola Dirimu',
        paragraphs: [
          patternTendency,
          patternResponse,
          patternBlindspot
        ]
      },
      learning: {
        title: 'Hal yang Mungkin Sedang Kamu Pelajari',
        text: learningTheme
      },
      dailyLife: {
        title: 'Hubungan, Aktivitas, dan Keseharian',
        items: [
          dailyLife.communication,
          dailyLife.decisionMaking,
          dailyLife.energyAndRest
        ]
      },
      currentSky: skySection,
      closing: {
        title: 'Pesan untuk Dirimu Saat Ini',
        text: closingMessage
      }
    }
  };
}
