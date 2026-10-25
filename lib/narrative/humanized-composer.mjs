// Canonical Humanized Narrative Composer for Bhumi Amartya
// Restores original result categories:
// 1. Secara Umum (3-4 paragraphs)
// 2. Ekonomi & Karier (3-4 paragraphs)
// 3. Asmara: Untuk Single (2-3 paragraphs) & Untuk Pasangan (2-3 paragraphs)
// 4. Kesehatan (2-3 paragraphs)
// 5. Spiritual (3-4 paragraphs)
// 6. Tantangan (3-4 paragraphs)
// Plus: Peta Langit Saat Ini (Current Sky & Transit Enriched)

const LIFE_PATH_DATA = {
  1: {
    core: 'inisiatif mandiri dan keberanian membuka langkah pertama',
    strength: 'kemampuan mengambil keputusan di saat situasi belum sepenuhnya jelas dan berani memimpin arah baru',
    blindspot: 'dorongan untuk memikul semua tanggung jawab sendirian karena merasa paling paham atau enggan merepotkan orang lain',
    learning: 'belajar bahwa menjadi mandiri bukan berarti harus selalu berjalan seorang diri tanpa melibatkan orang lain',
    workStyle: 'berkembang optimal di ruang yang memberi keleluasaan inisiatif, otonomi dalam menentukan alur kerja, dan kejelasan target',
    financialMindset: 'cenderung berani mengambil risiko produktif untuk membangun kemandirian finansial, namun perlu menjaga cadangan dana darurat agar tidak impulsif',
    workChallenge: 'menghindari rasa frustrasi saat ritme kerja orang lain tidak secepat standar pribadimu',
    loveSingle: 'Dalam membuka hati, kamu menghargai seseorang yang percaya diri dan memiliki dunianya sendiri. Kamu tidak mencari orang untuk bergantung, melainkan rekan setara yang bisa diajak tumbuh bersama.',
    loveCouple: 'Dalam hubungan berpasangan, kunci keharmonisanmu adalah menjaga komunikasi dua arah sebelum memutuskan rencana besar bersama, sehingga pasangan tidak merasa ditinggalkan dalam pengambilan keputusan.',
    healthFocus: 'Energi fisikmu biasanya melimpah saat sedang bersemangat, namun rawan mengalami ketegangan di area kepala, leher, atau mata saat terlalu memaksakan diri bekerja melampaui batas.',
    spiritualTheme: 'Pencarian spiritualmu bertumbuh ketika kamu menyadari bahwa kepemimpinan sejati lahir dari kerendahan hati dan kepasrahan kepada ritme hidup yang lebih luas.',
    challengeCore: 'Kecenderungan untuk cepat merasa gelisah saat ada hal yang berjalan di luar kendalimu.',
    closing: 'Mungkin tidak semua hal harus kamu selesaikan dalam satu tarikan napas. Memberi jeda sejenak bukan berarti langkahmu terhenti, melainkan caramu mengumpulkan ketenangan untuk melangkah lebih jauh.'
  },
  2: {
    core: 'kepekaan rasa, diplomasi, dan seni merajut kerja sama yang hangat',
    strength: 'kemampuan membaca suasana emosional dengan jernih, mendengarkan secara tulus, dan menjadi jembatan damai di tengah perbedaan',
    blindspot: 'kebiasaan menunda menyampaikan apa yang sebenarnya kamu rasakan karena khawatir merusak keharmonisan atau memicu gesekan',
    learning: 'belajar bahwa kejujuran yang disampaikan dengan tenang dan hangat adalah bentuk ketulusan tertinggi, bukan ancaman bagi hubungan',
    workStyle: 'sangat efektif dalam peran kemitraan, kolaborasi tim, mediasi, dan pekerjaan yang menuntut ketelitian rasa serta konseling',
    financialMindset: 'memiliki orientasi kehati-hatian dalam mengelola uang, cenderung mengutamakan rasa aman bersama keluarga daripada spekulasi berisiko tinggi',
    workChallenge: 'merawat batas profesional agar tidak terlalu menyerap beban emosional rekan kerja atau klien ke dalam pikiran pribadimu',
    loveSingle: 'Bagi kamu yang sedang single, hatimu mendambakan rasa aman dan keterikatan emosional yang tulus. Penting untuk tidak terburu-buru menurunkan standar hanya karena ingin segera merasa ditemani.',
    loveCouple: 'Untuk yang berpasangan, hubunganmu paling mekar saat ada waktu berkualitas untuk saling mencurahkan isi hati tanpa distraksi. Percakapan kecil yang jujur akan menjaga ikatan tetap lekat.',
    healthFocus: 'Tubuhmu sangat responsif terhadap ketegangan batin, terutama pada area pencernaan dan kualitas tidur. Menjaga suasana makan yang tenang dan ritme istirahat yang teratur adalah obat terbaikmu.',
    spiritualTheme: 'Jalan spiritualmu hadir lewat rasa syukur pada keindahan hubungan antarmanusia dan latihan menjaga ketenangan batin di tengah hiruk-pikuk sekitar.',
    challengeCore: 'Rasa ragu yang muncul saat harus menetapkan batasan tegas terhadap permintaan orang lain.',
    closing: 'Menjaga perasaan orang lain adalah kebaikan yang mulia, namun jangan sampai kamu lupa menyediakan ruang aman yang sama hangatnya untuk dirimu sendiri.'
  },
  3: {
    core: 'ekspresi kreatif, komunikasi yang hidup, dan optimisme yang menular',
    strength: 'kelincahan menangkap ide, menyederhanakan gagasan rumit menjadi menarik, dan menghidupkan suasana di lingkungan mana pun',
    blindspot: 'perhatian yang mudah terpecah ketika terlalu banyak peluang baru datang bersamaan, sehingga karya yang sudah dimulai rawan tertunda',
    learning: 'belajar memberi ketekunan pada satu hal yang paling bermakna sampai tuntas sebelum berpindah ke inspirasi berikutnya',
    workStyle: 'berkembang pesat di bidang komunikasi, media kreatif, edukasi, penulisan, seni, atau profesi yang mengandalkan daya persuasi dan narasi',
    financialMindset: 'arus kas cenderung dinamis mengikuti proyek kreatif; tantangannya adalah menyisihkan tabungan konsisten di saat pendapatan sedang tinggi',
    workChallenge: 'menjaga disiplin harian agar ide-ide cemerlang tidak hanya berhenti sebagai rencana di atas kertas',
    loveSingle: 'Saat mencari pasangan, kamu tertarik pada sosok yang komunikatif, memiliki selera humor, dan bisa diajak berdiskusi tentang berbagai topik secara lepas tanpa rasa canggung.',
    loveCouple: 'Dalam kehidupan berpasangan, keterbukaan berekspresi adalah napas hubunganmu. Luangkan waktu untuk mengobrol santai tanpa membicarakan urusan logistik atau kewajiban praktis semata.',
    healthFocus: 'Tenggorokan, saluran pernapasan, dan ritme energi saraf adalah area yang perlu diperhatikan. Hindari kebiasaan begadang saat larut dalam proyek malam hari.',
    spiritualTheme: 'Spiritualitas bagimu adalah ungkapan rasa syukur yang dirayakan melalui kegembiraan hidup, karya yang menginspirasi sesama, dan kejujuran hati.',
    challengeCore: 'Kecenderungan untuk menutupi rasa sedih atau lelah dengan tetap terlihat ceria di hadapan orang lain.',
    closing: 'Gagasanmu indah saat dibagikan kepada dunia, namun ia akan berbuah paling manis saat kamu memberinya waktu dan ketekunan untuk benar-benar mengakar.'
  },
  4: {
    core: 'ketekunan, fondasi yang kokoh, dan tanggung jawab praktis',
    strength: 'keandalan tinggi dalam menjaga komitmen, menata sistem kerja, dan membangun stabilitas jangka panjang yang tahan uji',
    blindspot: 'kekakuan yang muncul saat rencana mendadak berubah di luar kendali, yang bisa menimbulkan kecemasan atau rasa frustrasi berlebih',
    learning: 'belajar membedakan antara menjaga keteraturan yang sehat dan memberi sedikit ruang lentur bagi ketidakpastian hidup',
    workStyle: 'sangat unggul dalam manajemen operasional, perencanaan struktural, keuangan, teknik, dan pekerjaan yang menuntut presisi serta dedikasi nyata',
    financialMindset: 'sangat disiplin dalam menabung dan mengamankan aset riil; naluri proteksimu terhadap masa depan finansial tergolong kuat dan terukur',
    workChallenge: 'menghindari kebiasaan membebani diri dengan standar kesempurnaan yang terlalu kaku hingga sulit mendelegasikan tugas',
    loveSingle: 'Bagi yang single, kamu membutuhkan waktu untuk benar-benar percaya sebelum membuka ruang hati. Konsistensi perbuatan seseorang jauh lebih memikat bagimu daripada kata-kata manis.',
    loveCouple: 'Untuk yang berpasangan, caramu menunjukkan cinta sering kali berwujud tindakan nyata dan pemenuhan kebutuhan keluarga. Pasanganmu mungkin sesekali juga merindukan ungkapan kasih sayang yang lebih verbal dan spontan.',
    healthFocus: 'Area persendian, tulang belakang, dan otot bahu rawan tegang akibat postur kerja yang monoton atau beban mental yang ditahan lama. Lakukan peregangan rutin dan luangkan waktu relaksasi.',
    spiritualTheme: 'Bagi dirimu, laku spiritual hadir lewat ketulusan menjalankan tugas hidup sehari-hari dengan setia dan melihat kesucian di dalam keteraturan alam.',
    challengeCore: 'Rasa cemas yang tidak perlu saat menghadapi proses yang membutuhkan waktu dan belum menunjukkan hasil instan.',
    closing: 'Fondasi yang kuat adalah anugerah besar, namun rumah yang nyaman selalu membutuhkan jendela yang bisa dibuka agar angin segar tetap leluasa masuk.'
  },
  5: {
    core: 'jiwa merdeka, daya adaptasi yang lincah, dan rasa ingin tahu yang luas',
    strength: 'kemampuan membaca peluang baru, mudah menyesuaikan diri di berbagai lingkaran pergaulan, dan berani menjelajah jalan yang belum terpetakan',
    blindspot: 'kegelisahan yang cepat timbul saat menghadapi rutinitas yang monoton, yang kadang membuatmu ingin buru-buru berpindah sebelum hal itu membuahkan hasil',
    learning: 'belajar menemukan kebebasan sejati di dalam komitmen yang kamu pilih sendiri secara sadar, bukan semata-mata dengan cara menghindar',
    workStyle: 'berkembang di bidang yang mobile, ekspansif, konsultatif, perdagangan, diplomasi, media, atau karier yang menawarkan fleksibilitas jam kerja',
    financialMindset: 'peluang rezeki sering datang dari berbagai pintu tak terduga; kuncinya adalah menata pos keuangan agar pengeluaran untuk gaya hidup dan petualangan tetap berimbang',
    workChallenge: 'menjaga fokus penyelesaian tugas hingga tuntas saat rasa bosan mulai mengetuk pintu pikiran',
    loveSingle: 'Dalam urusan asmara, kamu membutuhkan pasangan yang tidak mengekang kebebasan berpikirmu dan memiliki wawasan luas untuk diajak bertualang bersama.',
    loveCouple: 'Bagi yang berpasangan, kejenuhan adalah hal yang wajar dalam ritme panjang hubungan. Mencoba aktivitas baru berdua atau memberi ruang pribadi yang sehat akan menyegarkan kembali keintimanmu.',
    healthFocus: 'Sistem saraf dan tingkat hormon stres cenderung berfluktuasi cepat. Batasi konsumsi kafein berlebih dan sediakan waktu grounding di alam terbuka untuk menenangkan pikiran.',
    spiritualTheme: 'Pencarian spiritualmu bertumbuh lewat perjumpaan dengan beragam tradisi dan pemahaman bahwa setiap perubahan hidup membawa pelajaran batin yang berharga.',
    challengeCore: 'Mengendalikan dorongan impulsif untuk mengambil keputusan mendadak saat sedang merasa tertekan.',
    closing: 'Dunia selalu menawarkan kebaruan yang memikat, namun kedalaman rasa dan makna sering kali baru kita temukan saat kita bersedia tinggal sedikit lebih lama di satu tempat.'
  },
  6: {
    core: 'tanggung jawab merawat, welas asih, dan menjaga keharmonisan lingkungan terdekat',
    strength: 'kemampuan hadir sebagai tempat berteduh yang menenangkan bagi keluarga, sahabat, dan komunitas dengan perhatian yang tulus',
    blindspot: 'dorongan untuk memperbaiki masalah semua orang sampai mengorbankan batas kesehatan batin dan waktu istirahat pribadimu',
    learning: 'belajar merawat orang lain tanpa mencampuri proses hidup mereka yang memang harus mereka jalani sendiri',
    workStyle: 'sangat cocok di bidang pelayanan sosial, kesehatan, pendidikan, manajemen sumber daya manusia, konseling, arsitektur interior, atau bisnis bernilai etis',
    financialMindset: 'cenderung memprioritaskan alokasi dana untuk kenyamanan rumah dan kesejahteraan keluarga; pastikan kamu juga memiliki alokasi investasi yang terproteksi secara mandiri',
    workChallenge: 'menghindari rasa kecewa mendalam ketika pengorbanan dan ketulusanmu tidak direspons dengan kadar yang sepadan oleh rekan kerja',
    loveSingle: 'Untuk yang single, kamu mencari relasi yang mengarah pada kehangatan rumah tangga dan komitmen jangka panjang. Berhati-hatilah agar tidak tertarik pada seseorang hanya karena ingin "menyelamatkannya".',
    loveCouple: 'Bagi yang berpasangan, hubunganmu terasa kokoh saat ada rasa saling menghargai peran masing-masing. Beri ruang bagi pasangan untuk berkontribusi dengan caranya sendiri tanpa perlu kamu koreksi terus-menerus.',
    healthFocus: 'Area dada, sirkulasi pernapasan, dan ritme metabolisme tubuh sangat dipengaruhi oleh suasana hati. Menjaga batas emosional akan melindungi energimu dari kelelahan kronis.',
    spiritualTheme: 'Bakti dan pelayanan tulus adalah pintu spiritualmu. Kebaikanmu akan paling bermakna saat bersumber dari cangkir batin yang sudah terisi penuh.',
    challengeCore: 'Rasa bersalah yang muncul ketika kamu harus menolak permintaan tolong orang lain demi menjaga kesehatanmu.',
    closing: 'Kasih yang paling sehat adalah kasih yang tidak menuntutmu untuk terus kehabisan napas demi menyenangkan semua pihak. Rawatlah dirimu terlebih dahulu dengan kehangatan yang sama.'
  },
  7: {
    core: 'pencarian kebenaran batin, ketajaman analisis, dan kedalaman kontemplasi',
    strength: 'kemampuan mengamati apa yang tersembunyi di balik permukaan, berpikir mendalam tanpa terpengaruh opini massa, dan intuisi intelektual yang tajam',
    blindspot: 'kecenderungan menarik diri terlalu jauh ke dalam ruang kesendirian hingga terasa dingin atau sulit dijangkau oleh orang terdekat',
    learning: 'belajar mempercayai proses hidup dan berani membagikan kerentanan hatimu kepada orang yang tepat, bukan hanya membagikan hasil analisismu',
    workStyle: 'sangat unggul dalam penelitian, analisis data, teknologi, filsafat, strategi kebijakan, penulisan mendalam, dan profesi yang membutuhkan waktu berpikir tanpa gangguan',
    financialMindset: 'memiliki pandangan rasional terhadap materi; uang dipandang sebagai instrumen untuk menjaga kemerdekaan berpikir dan ketenangan hidup, bukan semata-mata untuk status sosial',
    workChallenge: 'menghindari sikap skeptis berlebihan atau overthinking yang menghambat langkah eksekusi nyata di lapangan',
    loveSingle: 'Bagi kamu yang single, kamu membutuhkan seseorang yang bisa diajak berbicara mendalam tentang makna hidup dan menghormati kebutuhanmu akan ruang hening pribadi.',
    loveCouple: 'Untuk yang berpasangan, tantangan terbesarmu adalah mengekspresikan rasa sayang secara hangat. Jangan biarkan pasangan merasa harus menebak-nebak apa yang sedang berkecamuk di dalam kepalamu.',
    healthFocus: 'Kesehatan mental dan kualitas tidur adalah fondasi utamamu. Otak yang aktif bekerja hingga larut malam membutuhkan ritual pendinginan pikiran sebelum tidur, seperti meditasi atau membaca bacaan ringan.',
    spiritualTheme: 'Pencarian spiritualmu adalah kebutuhan esensial jiwa. Keheningan dan studi mendalam adalah caramu menyelaraskan diri dengan hakikat alam semesta.',
    challengeCore: 'Kecenderungan untuk mengisolasi diri saat sedang terluka atau merasa tidak dipahami oleh lingkungan sekitar.',
    closing: 'Mencari jawaban ke dalam diri adalah anugerah yang jernih. Namun jangan lupa untuk sesekali duduk bersama orang terdekat dan menikmati obrolan biasa yang hangat tanpa perlu membedah maknanya.'
  },
  8: {
    core: 'daya kelola, kepemimpinan strategis, dan orientasi pada dampak nyata',
    strength: 'keberanian mengambil tanggung jawab besar, ketegasan menavigasi krisis, dan visi tajam dalam mengorganisasi sumber daya untuk mencapai hasil optimal',
    blindspot: 'dorongan mengendalikan segala aspek yang bisa membuatmu terlihat terlalu keras atau menuntut standar yang membebani orang di sekitarmu',
    learning: 'belajar bahwa kepemimpinan yang paling disegani lahir dari keadilan, empati, dan kesabaran mendampingi proses orang lain bertumbuh',
    workStyle: 'sangat berkembang di posisi kepemimpinan korporasi, kewirausahaan, manajemen investasi, hukum bisnis, dan proyek-proyek berskala besar',
    financialMindset: 'memiliki naluri alami dalam memutar modal dan melihat peluang ekspansi; penting untuk menjaga keseimbangan etika dan tidak terjebak dalam perlombaan materi tanpa batas',
    workChallenge: 'menjaga tensi emosi agar tidak mudah meledak saat eksekusi tim di lapangan berjalan lebih lambat dari ekspektasimu',
    loveSingle: 'Bagi yang single, kamu tertarik pada sosok yang tangguh, mandiri, dan memiliki integritas moral yang sepadan dengan karaktermu yang kuat.',
    loveCouple: 'Dalam kehidupan berpasangan, hindari memperlakukan hubungan seperti negosiasi bisnis. Kehangatan rumah tangga membutuhkan kelembutan, kerelaan mengalah, dan ruang untuk saling menerima kelemahan.',
    healthFocus: 'Tekanan darah, sirkulasi peredaran darah, dan tingkat ketegangan otot perlu dijaga secara cermat. Luangkan waktu untuk olahraga aerobik yang teratur dan istirahat yang berkualitas.',
    spiritualTheme: 'Spiritualitas bagimu adalah memahami hukum sebab-akibat (karma) dan menggunakan kekuatan serta kelimpahan materi sebagai sarana berbuat kebaikan bagi banyak orang.',
    challengeCore: 'Rasa takut kehilangan kendali atas reputasi, posisi, atau hasil kerja keras yang telah kamu bangun.',
    closing: 'Pencapaian besar terasa paling manis ketika dibangun di atas tubuh yang sehat dan hati yang tidak terbebani rasa harus selalu menjadi pemenang dalam setiap keadaan.'
  },
  9: {
    core: 'pandangan luas, welas asih universal, dan keikhlasan melepaskan',
    strength: 'kemampuan melihat gambaran besar kehidupan, empati mendalam pada mereka yang terpinggirkan, dan jiwa dermawan yang tulus',
    blindspot: 'menyimpan kekecewaan dalam diam ketika kenyataan dunia atau perilaku orang lain tidak seindah idealisme tinggi yang ada di kepalamu',
    learning: 'belajar menerima ketidaksempurnaan dunia dan menyadari bahwa setiap orang bertumbuh dengan kecepatannya masing-masing',
    workStyle: 'sangat cocok di bidang kemanusiaan, diplomasi internasional, seni inspiratif, hukum publik, lingkungan hidup, dan edukasi transformatif',
    financialMindset: 'rezeki cenderung mengalir deras saat kamu berniat memberi manfaat bagi orang banyak; tetaplah disiplin dalam memisahkan pos keuangan pribadi dengan bantuan sosial',
    workChallenge: 'merawat motivasi kerja agar tidak mudah merasa lelah mental (burnout) saat menghadapi birokrasi atau sistem yang lambat berubah',
    loveSingle: 'Untuk kamu yang single, kamu mendambakan koneksi jiwa yang melampaui ketertarikan fisik semata. Pastikan kamu melihat calon pasangan apa adanya, bukan memproyeksikan citra idealmu kepadanya.',
    loveCouple: 'Bagi yang berpasangan, hubunganmu bertumbuh saat kalian berdua memiliki visi bersama untuk memberi dampak positif bagi sekitar. Jaga komunikasi harian agar tidak terlalu abstrak dan tetap menyentuh kebutuhan praktis berdua.',
    healthFocus: 'Sistem imunitas dan kesehatan kelenjar getah bening sangat peka terhadap suasana batin. Aktivitas detoksifikasi tubuh dan tidur yang cukup adalah kunci menjaga daya tahan fisikmu.',
    spiritualTheme: 'Keikhlasan melepaskan apa yang telah usai dan memaafkan masa lalu adalah inti evolusi batinmu. Di sanalah letak kedamaian sejatimu.',
    challengeCore: 'Kecenderungan untuk memendam luka batin masa lalu dan sulit melepaskan harapan yang sudah tidak lagi realistis.',
    closing: 'Kamu tidak perlu membenahi seluruh dunia hari ini. Cukup rawat apa yang ada di hadapanmu saat ini dengan ketulusan dan kelembutan yang sama.'
  },
  11: {
    core: 'intuisi yang jernih, kepekaan batin, dan inspirasi bagi sesama',
    strength: 'daya tangkap naluriah yang peka membaca dinamika terselubung dan kemampuan menyalurkan wawasan yang mencerahkan pikiran orang lain',
    blindspot: 'kepekaan sensorik yang berlebihan terhadap energi lingkungan sekitar sehingga mudah merasa lelah tanpa alasan fisik yang jelas',
    learning: 'belajar menyaring stimulasi luar, menetapkan proteksi energi batin, dan membumikan wawasan intuitif ke dalam tindakan nyata sehari-hari',
    workStyle: 'unggul dalam konseling, kepemimpinan spiritual, psikologi, media kreatif, arsitektur ide, dan peran penasihat strategis',
    financialMindset: 'keuangan bertumbuh saat karyamu selaras dengan nilai kebenaran batinmu; hindari spekulasi finansial yang didorong oleh kepanikan emosional',
    workChallenge: 'menghindari kecemasan mental akibat terlalu banyak menyerap ekspektasi orang-orang di sekitarmu',
    loveSingle: 'Bagi yang single, kamu mencari belahan jiwa yang bisa memahami kedalaman intuisi dan gelombang perasaanmu tanpa menilaimu aneh atau berlebihan.',
    loveCouple: 'Dalam berpasangan, komunikasi telepati sering terasa, namun tetap membutuhkan kata-kata yang jelas untuk mengonfirmasi rasa agar tidak timbul asumsi keliru.',
    healthFocus: 'Sistem saraf pusat dan ketegangan mata sangat rentan overstimulasi. Mengurangi waktu di depan layar dan berjalan tanpa alas kaki di atas rumput akan membantu grounding energimu.',
    spiritualTheme: 'Jalanmu adalah menjadi lentera yang tenang. Kamu tidak perlu berteriak untuk didengar; kehadiranmu yang hening sudah membawa pengaruh menenangkan.',
    challengeCore: 'Mengelola gelombang keraguan diri saat intuisi batinmu berbenturan dengan logika umum masyarakat.',
    closing: 'Kepekaanmu adalah anugerah yang lembut. Rawatlah dengan istirahat yang cukup, batas pergaulan yang sehat, dan kebiasaan sederhana yang menenangkan jiwa.'
  },
  22: {
    core: 'pembangunan visi besar yang berpijak kokoh di bumi',
    strength: 'perpaduan langka antara impian transformatif berskala luas dan ketangguhan praktis untuk mewujudkannya batu demi batu hingga selesai',
    blindspot: 'beban ekspektasi yang terlalu berat pada pundak sendiri karena merasa harus selalu menghasilkan karya besar yang sempurna',
    learning: 'belajar menikmati setiap langkah kecil dalam proses tanpa terus-menerus terburu-buru mengejar pencapaian puncak',
    workStyle: 'sangat berpengaruh dalam pembangunan infrastruktur, perencanaan kota, filantropi terstruktur, kepemimpinan institusi besar, dan manajemen makro',
    financialMindset: 'mampu mengelola arus modal besar dengan perhitungan matang; kuncinya adalah menjaga diversifikasi aset dan tidak menaruh semua beban pada satu proyek',
    workChallenge: 'menjaga kesabaran saat orang lain di sekitarmu membutuhkan waktu lebih lama untuk memahami cetak biru gagasanmu',
    loveSingle: 'Untuk yang single, kamu membutuhkan pasangan yang matang secara emosional dan mampu menjadi tempat berteduh yang stabil di tengah kesibukan proyek besarmu.',
    loveCouple: 'Bagi yang berpasangan, luangkan waktu berkualitas yang murni untuk berdua tanpa membicarakan urusan pekerjaan, target masa depan, atau tanggung jawab publik.',
    healthFocus: 'Kelelahan fisik menyeluruh dan ketegangan sistem otot punggung sering mengintai jika kamu lupa mengambil cuti berkala. Jadwalkan istirahat sebagai bagian wajib dari rencana kerjamu.',
    spiritualTheme: 'Bagi dirimu, spiritualitas adalah kerja nyata yang mewujudkan kebaikan ilahi menjadi struktur fisik yang bermanfaat bagi generasi mendatang.',
    challengeCore: 'Rasa frustrasi yang muncul ketika kenyataan praktis berjalan lambat dan terhambat oleh keterbatasan sumber daya.',
    closing: 'Karya besar dibangun dari hari-hari biasa yang dijalani dengan kesetiaan. Jangan abaikan kebahagiaan sederhana dan tawa hangat di sepanjang perjalananmu.'
  },
  33: {
    core: 'pelayanan tanpa pamrih, welas asih mendalam, dan keteladanan yang meneduhkan',
    strength: 'kemampuan mendengarkan tanpa menghakimi, kehangatan empati yang menyembuhkan luka batin sesama, dan ketulusan hati yang tulus',
    blindspot: 'mudah merasa bersalah saat harus beristirahat atau menolak permintaan bantuan orang lain',
    learning: 'belajar bahwa menjaga batas diri adalah bagian penting dari amanah agar lentera kasihmu bisa terus menyala tanpa membakar dirimu sendiri',
    workStyle: 'sangat menonjol dalam bidang penyembuhan, pengasuhan, konseling keluarga, advokasi kemanusiaan, seni terapeutik, dan pelayanan publik',
    financialMindset: 'rezeki cenderung selalu cukup saat dialirkan untuk kebaikan; tetaplah memiliki penasihat keuangan yang objektif untuk menjaga pos dana pribadimu',
    workChallenge: 'menghindari penyerapan energi negatif dari lingkungan yang sedang menghadapi krisis emosional',
    loveSingle: 'Bagi yang single, carilah pasangan yang bisa merawatmu kembali dengan kadar ketulusan yang sama, bukan seseorang yang hanya ingin menikmati perhatianmu.',
    loveCouple: 'Untuk yang berpasangan, hubunganmu adalah oasis ketenangan. Jaga agar komunikasi di rumah tetap menjadi ruang relaksasi yang bebas dari tuntutan peran di luar.',
    healthFocus: 'Energi vital dan sistem limfatik membutuhkan perhatian. Beri tubuh asupan makanan segar, air yang cukup, dan tidur malam yang tidak terpotong-potong.',
    spiritualTheme: 'Spiritualitasmu bersinar lewat kelembutan kata dan ketulusan doa. Kehadiranmu yang damai adalah obat bagi hati yang sedang gundah.',
    challengeCore: 'Beban emosional yang menumpuk akibat merasa bertanggung jawab atas kebahagiaan semua orang di sekitarmu.',
    closing: 'Bahkan pohon yang paling rindang pun membutuhkan hujan dan tanah subur untuk merawat dirinya sendiri. Sayangilah dirimu dengan kehangatan yang sama seperti kamu menyayangi sesama.'
  }
};

const ARCANA_DATA = {
  'The Magician': {
    quality: 'daya kreasi dan inisiatif aktif',
    careerInsight: 'memiliki kelincahan mengubah sumber daya yang ada menjadi peluang nyata dengan komunikasi yang meyakinkan',
    loveInsight: 'membawa kesegaran dalam percakapan dan keterbukaan mencoba hal-hal baru bersama pasangan',
    spiritualInsight: 'menyadari bahwa niat jernih di dalam batin adalah benih awal dari setiap perwujudan fisik',
    challengeInsight: 'waspada terhadap godaan untuk memanipulasi situasi demi mencapai tujuan secara instan'
  },
  'The High Priestess': {
    quality: 'ketenangan batin dan ketajaman intuisi',
    careerInsight: 'sangat jeli mengamati celah yang luput dari pandangan orang lain dan tepat dalam membaca waktu yang tepat untuk bertindak',
    loveInsight: 'menghargai kedalaman emosional dan hubungan batin yang tidak perlu diobral dengan kata-kata berlebihan',
    spiritualInsight: 'menemukan kebijaksanaan lewat keheningan dan mendengarkan bisikan nurani tanpa keraguan',
    challengeInsight: 'waspada terhadap kecenderungan menyimpan rahasia atau bersikap terlalu tertutup hingga sulit dipahami'
  },
  'The Empress': {
    quality: 'daya rawat yang subur dan kehangatan rasa',
    careerInsight: 'mampu menciptakan suasana kerja yang harmonis dan menumbuhkan proyek-proyek kreatif dengan kesabaran alami',
    loveInsight: 'menunjukkan kasih sayang lewat perhatian fisik, kenyamanan rumah, dan penerimaan yang tulus',
    spiritualInsight: 'merasakan kehadiran ilahi melalui keindahan alam semesta dan kelimpahan kehidupan sehari-hari',
    challengeInsight: 'menghindari sikap protektif berlebihan atau memanjakan orang lain sampai mengabaikan kemandirian mereka'
  },
  'The Emperor': {
    quality: 'ketegasan struktur dan kepemimpinan yang stabil',
    careerInsight: 'unggul dalam menegakkan keteraturan, menetapkan batas wewenang yang jelas, dan mengawal target hingga tercapai',
    loveInsight: 'memberikan rasa aman, kepastian komitmen, dan perlindungan nyata bagi pasangan serta keluarga',
    spiritualInsight: 'menyadari bahwa disiplin batin dan integritas moral adalah fondasi dari kebebasan sejati',
    challengeInsight: 'menghindari kekakuan berpikir atau kesulitan berkompromi saat situasi membutuhkan kelenturan'
  },
  'The Hierophant': {
    quality: 'pencarian nilai luhur dan kearifan tradisi',
    careerInsight: 'berkembang sebagai pembimbing, rujukan etika, atau penjaga nilai-nilai luhur di dalam organisasi',
    loveInsight: 'menjunjung tinggi keselarasan nilai hidup, komitmen pernikahan, dan rasa hormat yang mendalam',
    spiritualInsight: 'menemukan kedamaian lewat pendalaman ajaran kebijaksanaan dan ritual-ritual yang menenangkan batin',
    challengeInsight: 'waspada terhadap sikap dogmatis atau kecenderungan menilai orang lain berdasarkan standar moral pribadi'
  },
  'The Lovers': {
    quality: 'keselarasan pilihan hati dan komunikasi terbuka',
    careerInsight: 'bekerja paling produktif saat proyek yang dikerjakan benar-benar selaras dengan suara hati dan nilai pribadimu',
    loveInsight: 'sangat peka terhadap kehangatan komunikasi dua arah dan kejujuran emosional tanpa kepura-puraan',
    spiritualInsight: 'memahami bahwa setiap keputusan hidup adalah sarana untuk menyatukan dualitas di dalam diri',
    challengeInsight: 'menghindari keraguan berkepanjangan saat dihadapkan pada pilihan sulit yang menuntut komitmen tegas'
  },
  'The Chariot': {
    quality: 'fokus tekad dan disiplin mengarahkan energi',
    careerInsight: 'memiliki daya dorong tinggi untuk menuntaskan tantangan sulit dan tidak mudah menyerah oleh rintangan awal',
    loveInsight: 'membutuhkan pasangan yang bisa berjalan beriringan dan tidak menahan laju pertumbuhan pribadimu',
    spiritualInsight: 'mengembangkan penguasaan diri atas tarikan emosi yang saling bertolak belakang agar batin tetap terarah',
    challengeInsight: 'menghindari dorongan untuk terus melaju kencang tanpa memberi waktu istirahat yang cukup bagi tubuh'
  },
  'Justice': {
    quality: 'kejujuran menimbang dan kesadaran sebab-akibat',
    careerInsight: 'cermat dalam menganalisis fakta, menyusun kontrak kerja yang adil, dan mengambil keputusan yang berimbang',
    loveInsight: 'menghargai kesetaraan peran, keterbukaan informasi, dan komitmen yang dipegang dengan penuh tanggung jawab',
    spiritualInsight: 'menyelami hukum karma dengan lapang dada dan menyadari bahwa kejujuran batin membawa ketenteraman sejati',
    challengeInsight: 'menghindari sikap terlalu kritis atau menghakimi kesalahan kecil orang lain dengan standar yang kaku'
  },
  'The Hermit': {
    quality: 'kebijaksanaan hening dan refleksi mendalam',
    careerInsight: 'sangat mandiri dalam bekerja, menghasilkan analisis yang mendalam dan tidak terburu-buru mengejar popularitas semata',
    loveInsight: 'membutuhkan pasangan yang menghargai waktu kesendirianmu dan bisa diajak berdiskusi tentang esensi hidup',
    spiritualInsight: 'menemukan lentera penerang di dalam diri sendiri lewat waktu jeda dan kontemplasi yang tenang',
    challengeInsight: 'waspada agar kesendirian yang menyehatkan tidak berubah menjadi isolasi sosial yang memisahkanmu dari dunia'
  },
  'Wheel of Fortune': {
    quality: 'keluwesan menyikapi dinamika pasang-surut kehidupan',
    careerInsight: 'pandai membaca momentum perubahan pasar dan berani memanfaatkan peluang di saat situasi sedang bergeser',
    loveInsight: 'memahami bahwa setiap hubungan memiliki musimnya sendiri, ada saatnya dekat dan ada saatnya memberi ruang',
    spiritualInsight: 'belajar berserah pada siklus waktu tanpa kehilangan jangkar ketenangan di pusat kesadaran batin',
    challengeInsight: 'menghindari sikap pasrah berlebihan seolah nasib tidak bisa diupayakan melalui ikhtiar sadar'
  },
  'Strength': {
    quality: 'kelembutan yang teguh dan penguasaan emosi',
    careerInsight: 'mampu menyelesaikan konflik kerja yang pelik dengan pendekatan persuasif tanpa perlu menggunakan kekerasan kata',
    loveInsight: 'menghadirkan kesabaran yang menyejukkan saat menghadapi pasangan yang sedang dalam kondisi emosi sensitif',
    spiritualInsight: 'menyadari bahwa kekuatan sejati bukan pada kemampuan menundukkan orang lain, melainkan menundukkan ego diri',
    challengeInsight: 'menghindari kebiasaan memendam rasa lelah batin demi terlihat selalu kuat di mata orang lain'
  },
  'The Hanged Man': {
    quality: 'kerelaan melihat dari sudut pandang baru dan kesabaran menunggu',
    careerInsight: 'mampu menemukan solusi kreatif yang tidak terpikirkan orang lain saat sebuah proyek sedang mengalami kebuntuan',
    loveInsight: 'bersedia memberi ruang dan waktu bagi hubungan untuk matang tanpa memaksakan kehendak sepihak',
    spiritualInsight: 'memahami bahwa jeda dan keheningan sering kali membuka pintu wawasan batin yang jauh lebih dalam',
    challengeInsight: 'waspada terhadap rasa enggan melangkah atau menunda keputusan penting dengan dalih sedang menunggu waktu'
  },
  'Death': {
    quality: 'keberanian melepaskan hal usai untuk pembaruan babak baru',
    careerInsight: 'tegas dalam memutus strategi usang yang tidak lagi relevan dan berani bertransformasi menuju bidang baru',
    loveInsight: 'bersedia melepaskan pola lama dalam berkomunikasi agar hubungan bisa berevolusi ke tingkat kedewasaan yang lebih sehat',
    spiritualInsight: 'merangkul siklus kematian simbolis dan kelahiran kembali sebagai proses pembersihan jiwa yang alami',
    challengeInsight: 'waspada terhadap rasa takut berlebihan menghadapi perpisahan atau perubahan mendasar dalam hidup'
  },
  'Temperance': {
    quality: 'seni merajut keseimbangan dan kesabaran memadukan perbedaan',
    careerInsight: 'unggul dalam menjembatani berbagai kepentingan yang berbeda dan menjaga kestabilan alur kerja jangka panjang',
    loveInsight: 'membawa ketenangan dalam relasi harian, meredam pertengkaran kecil, dan merawat harmoni yang seimbang',
    spiritualInsight: 'melatih jalan tengah dalam segala hal dan menyelaraskan getaran pikiran dengan denyut kehidupan',
    challengeInsight: 'menghindari kompromi yang berlebihan sampai mengorbankan prinsip dasar yang sebenarnya sangat kamu pegang'
  },
  'The Devil': {
    quality: 'kepekaan menyadari keterikatan emosi dan daya pembebasan diri',
    careerInsight: 'sangat memahami psikologi keinginan manusia dan daya tarik materi, cerdas dalam negosiasi yang menantang',
    loveInsight: 'menyadari pentingnya menjaga batas sehat dalam hubungan agar ketertarikan intens tidak berubah menjadi ketergantungan obsesif',
    spiritualInsight: 'belajar mengenali sisi bayang-bayang (shadow self) dan membebaskan jiwa dari ilusi rasa takut serta keserakahan',
    challengeInsight: 'waspada agar tidak terjebak dalam pola kebiasaan yang merugikan kesehatan fisik atau batin'
  },
  'The Tower': {
    quality: 'daya lentur bangkit dari goncangan dan membangun fondasi jujur',
    careerInsight: 'tangguh dalam menghadapi krisis mendadak dan mampu membangun kembali sistem yang lebih kokoh dan transparan',
    loveInsight: 'berani meruntuhkan kepura-puraan dalam hubungan demi mencapai kejujuran emosional yang sejati',
    spiritualInsight: 'memahami bahwa runtuhnya ilusi ego sering kali menjadi awal dari kebangkitan spiritual yang sesungguhnya',
    challengeInsight: 'mengelola rasa terkejut dan tidak terburu-buru mengambil kesimpulan negatif saat terjadi perubahan mendadak'
  },
  'The Star': {
    quality: 'harapan jernih, ketulusan rasa, dan optimisme yang tenang',
    careerInsight: 'mampu menghadirkan visi masa depan yang menginspirasi tim dan bekerja dengan niat tulus tanpa pamrih berlebih',
    loveInsight: 'membawa kesegaran, kehangatan empati, dan kepercayaan yang meneduhkan di dalam hubungan asmara',
    spiritualInsight: 'merasakan keterhubungan batin yang mendalam dengan alam semesta dan percaya pada jalan bimbingan Ilahi',
    challengeInsight: 'menjaga agar harapan idealis tetap berpijak pada langkah-langkah praktis dan realitas yang ada'
  },
  'The Moon': {
    quality: 'imajinasi mendalam, kepekaan rasa, dan eksplorasi alam bawah sadar',
    careerInsight: 'memiliki intuisi tajam dalam menangkap tren artistik atau perubahan sentimen psikologis di masyarakat',
    loveInsight: 'sangat peka terhadap getaran rasa pasangan; penting untuk membedakan antara firasat nyata dan rasa cemas pribadi',
    spiritualInsight: 'berani menatap kedalaman batin dan mentransformasi ketidakpastian emosi menjadi karya atau doa yang hening',
    challengeInsight: 'menghindari overthinking atau membiarkan ilusi kekhawatiran mengaburkan kejernihan logika berpikir'
  },
  'The Sun': {
    quality: 'kejujuran berekspresi, kehangatan rasa syukur, dan vitalitas membumi',
    careerInsight: 'memancarkan daya kepemimpinan yang ramah, menghadirkan transparansi kerja, dan mudah menarik dukungan rekanan',
    loveInsight: 'menghadirkan kegembiraan yang tulus, keterbukaan hati, dan kebahagiaan sederhana dalam kebersamaan sehari-hari',
    spiritualInsight: 'merayakan anugerah kehidupan dengan rasa syukur yang hidup dan menyebarkan kebaikan kepada sesama',
    challengeInsight: 'menjaga kerendahan hati agar rasa percaya diri yang tinggi tidak tergelincir menjadi sikap arogan'
  },
  'Judgement': {
    quality: 'kejujuran pada panggilan jiwa dan kesadaran babak baru',
    careerInsight: 'mampu mengevaluasi masa lalu dengan objektif dan berani mengambil langkah berani untuk menjawab panggilan karier sejati',
    loveInsight: 'membuka pintu pengampunan, memulihkan luka komunikasi lama, dan menyambut babak kedewasaan relasi yang lebih utuh',
    spiritualInsight: 'merasakan kebangkitan kesadaran batin untuk hidup selaras dengan tujuan jiwa yang lebih luhur',
    challengeInsight: 'menghindari rasa sesal yang berlarut-larut atas keputusan di masa lalu; jadikan pelajaran sebagai bekal melangkah'
  },
  'The World': {
    quality: 'kemampuan menuntaskan amanah dan keutuhan rasa syukur',
    careerInsight: 'mampu menyelesaikan proyek besar dengan tuntas, merangkum hasil kerja secara komprehensif, dan siap melangkah ke jenjang global',
    loveInsight: 'merasakan kepuasan batin saat hubungan mencapai titik kedewasaan, saling menghargai, dan merasa utuh bersama',
    spiritualInsight: 'menyadari kesatuan antara diri pribadi dengan seluruh jalinan alam semesta dalam harmoni yang damai',
    challengeInsight: 'bersedia memulai kembali dari awal saat satu siklus keberhasilan telah mencapai garis akhirnya'
  },
  'The Fool': {
    quality: 'keterbukaan pada pengalaman baru dengan hati yang ringan',
    careerInsight: 'berani mengambil inisiatif rintisan baru, tidak terkekang oleh paradigma usang, dan terbuka pada metode modern',
    loveInsight: 'menghadirkan spontanitas yang manis dan keberanian membuka lembaran baru tanpa dibebani prasangka masa lalu',
    spiritualInsight: 'melatih kepolosan hati dan berserah secara total pada bimbingan hidup dengan keyakinan yang tulus',
    challengeInsight: 'waspada terhadap sikap tergesa-gesa atau kurang cermat memeriksa detail praktis sebelum melangkah'
  }
};

const SUN_SIGN_DATA = {
  Aries: { trait: 'dorongan inisiatif dinamis dan keberanian melangkah', element: 'Api' },
  Taurus: { trait: 'ketekunan membumi, apresiasi estetika, dan stabilitas nilai', element: 'Tanah' },
  Gemini: { trait: 'kelincahan komunikasi, rasa ingin tahu luas, dan adaptasi ide', element: 'Udara' },
  Cancer: { trait: 'kepekaan intuitif, daya rawat emosional, dan perlindungan keluarga', element: 'Air' },
  Leo: { trait: 'kehangatan memimpin, kemurahan hati, dan ekspresi martabat diri', element: 'Api' },
  Virgo: { trait: 'ketelitian analisis, pengabdian pelayanan, dan perbaikan berkelanjutan', element: 'Tanah' },
  Libra: { trait: 'diplomasi rasa, keadilan pertimbangan, dan keharmonisan relasi', element: 'Udara' },
  Scorpio: { trait: 'kedalaman observasi, daya tahan transformasi, dan keteguhan batin', element: 'Air' },
  Sagittarius: { trait: 'wawasan filosofis, optimisme mencari kebenaran, dan jiwa petualang', element: 'Api' },
  Capricorn: { trait: 'disiplin integritas, ketahanan jangka panjang, dan tanggung jawab praktis', element: 'Tanah' },
  Aquarius: { trait: 'visi kemanusiaan, pemikiran independen, dan orisinalitas gagasan', element: 'Udara' },
  Pisces: { trait: 'empati welas asih, imajinasi batin, dan kepekaan spiritual mendalam', element: 'Air' }
};

const HUMAN_DESIGN_PROFILES = {
  Generator: {
    work: 'Energimu bekerja secara konsisten saat merespons apa yang hadir di hadapanmu. Kamu paling produktif saat mencurahkan tenaga pada pekerjaan yang benar-benar memantik rasa puas di akhir hari.',
    rest: 'Tubuhmu memberi sinyal jelas ketika tenagamu sudah tuntas terpakai; tidur pulas di malam hari adalah caramu mengisi ulang daya hidup.',
    challenge: 'Rasa frustrasi yang muncul ketika kamu memaksakan diri menginisiasi sesuatu dari pikiran rasional tanpa menunggu respon spontan tubuhmu.'
  },
  'Manifesting Generator': {
    work: 'Kamu memiliki kapasitas mengerjakan beberapa alur sekaligus dan bergerak dengan ritme yang cepat. Kamu belajar paling baik melalui tindakan nyata dan tidak ragu mengoreksi arah di tengah jalan.',
    rest: 'Luangkan jeda pendek di antara lompatan aktivitasmu agar sistem saraf tidak terus berada dalam kondisi siaga tinggi.',
    challenge: 'Kecenderungan untuk melompati tahapan penting atau lupa memberi kabar kepada rekan kerja sebelum mengubah haluan rencana.'
  },
  Projector: {
    work: 'Kekuatan utamamu bukan pada ketahanan kerja fisik yang berjam-jam, melainkan pada ketajaman melihat sistem, memandu arah, dan membaca potensi orang lain secara efisien.',
    rest: 'Waktu hening dan istirahat mandiri bukan bentuk kemalasan bagimu, melainkan kebutuhan esensial untuk menjaga kejernihan pandanganmu.',
    challenge: 'Rasa pahit atau lelah batin yang timbul saat kamu memaksakan diri bekerja seperti tipe energi lain demi membuktikan nilai dirimu.'
  },
  Manifestor: {
    work: 'Kamu membawa dorongan alami untuk membuka babak baru dan memicu gerakan tanpa menunggu aba-aba. Kamu paling nyaman saat memiliki otoritas penuh atas langkahmu.',
    rest: 'Manfaatkan jeda di antara gelombang inisiatifmu untuk beristirahat tanpa beban; dorongan berkarya akan datang kembali secara alami.',
    challenge: 'Resistensi atau penolakan dari lingkungan sekitar yang sering timbul hanya karena kamu lupa memberi informasi sebelum melangkah.'
  },
  Reflector: {
    work: 'Kamu adalah cermin yang sangat peka terhadap kesehatan lingkungan kerjamu. Wawasanmu sangat bernilai dalam menilai apakah sebuah tim atau proyek sedang berjalan di jalur yang sehat.',
    rest: 'Pilihlah ruang tidur dan tempat berkarya yang tenang, bersih, dan bebas dari muatan emosi yang campur aduk.',
    challenge: 'Rasa bingung atau terombang-ambing saat kamu menyerap terlalu banyak ekspektasi dan kegelisahan orang-orang di sekitarmu.'
  }
};

/**
 * Filter and find relevant transits for specific themes
 */
function extractCategoryTransits(personalTransits, currentSky) {
  const transits = personalTransits?.allTransits || personalTransits?.primaryTransits || [];
  const retrogrades = currentSky?.activeRetrogrades || [];

  // Career: Saturn, Jupiter, Mercury, Sun, Mars aspects or houses 2, 6, 10
  const careerTransits = transits.filter((t) => {
    const p = t.planetName || t.planet || '';
    const h = t.houseFromMoon || 0;
    return ['Saturn', 'Jupiter', 'Mercury', 'Mars', 'Sun'].includes(p) || [2, 6, 10].includes(h);
  });

  // Love: Venus, Moon, Mercury, Jupiter, or houses 5, 7
  const loveTransits = transits.filter((t) => {
    const p = t.planetName || t.planet || '';
    const h = t.houseFromMoon || 0;
    return ['Venus', 'Moon', 'Mercury', 'Jupiter'].includes(p) || [5, 7].includes(h);
  });

  // Spiritual: Jupiter, Saturn, Ketu, Rahu, Moon in specific Nakshatras, or houses 8, 9, 12
  const spiritualTransits = transits.filter((t) => {
    const p = t.planetName || t.planet || '';
    const h = t.houseFromMoon || 0;
    return ['Jupiter', 'Saturn', 'Ketu', 'Rahu'].includes(p) || [8, 9, 12].includes(h);
  });

  // Challenges: Saturn, Mars, Rahu, Ketu, retrogrades, Sade Sati, Kantaka, Ashtama
  const challengeTransits = transits.filter((t) => {
    const special = t.specialType || '';
    const p = t.planetName || t.planet || '';
    const h = t.houseFromMoon || 0;
    return Boolean(special) || ['Saturn', 'Mars', 'Rahu', 'Ketu'].includes(p) || [6, 8, 12].includes(h);
  });

  return {
    career: careerTransits.slice(0, 2),
    love: loveTransits.slice(0, 2),
    spiritual: spiritualTransits.slice(0, 2),
    challenge: challengeTransits.slice(0, 2),
    retrogrades
  };
}

/**
 * Compose the comprehensive humanized reading for all 6 core categories
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
  const lpNum = Number(lifePath) || 9;
  const lp = LIFE_PATH_DATA[lpNum] || LIFE_PATH_DATA[9];
  const arcana = ARCANA_DATA[arcanaName] || ARCANA_DATA['The Sun'];
  const sun = SUN_SIGN_DATA[sunSign] || SUN_SIGN_DATA['Aries'];
  const hdType = humanDesign?.type;
  const hd = hdType && HUMAN_DESIGN_PROFILES[hdType] ? HUMAN_DESIGN_PROFILES[hdType] : null;

  const enrichedTransits = extractCategoryTransits(personalTransits, currentSky);

  // ----------------------------------------------------
  // 1. SECARA UMUM (3-4 Paragraf)
  // ----------------------------------------------------
  const secaraUmumP1 = `Halo, ${safeName}. Setiap individu terlahir dengan perpaduan ritme dan kecenderungan yang khas dalam memandang dunia. Dari struktur blueprint lahirmu, terpancar perpaduan yang memikat antara kualitas ${lp.core} dan ${sun.trait}. Kehadiran pola ini memberimu ${lp.strength}, terutama saat kamu dihadapkan pada situasi baru yang membutuhkan pijakan tenang dan arah yang jelas.`;

  let secaraUmumP2 = '';
  if (hd) {
    secaraUmumP2 = `Dalam dinamika energi sehari-hari, cetak biru Human Design menunjukkan bahwa kamu membawa tipe ${hdType}. ${hd.work} Ketika dipadukan dengan sifat ${arcana.quality} dari Destiny Matrix, ada dorongan batin untuk selalu menyelaraskan apa yang kamu kerjakan dengan kejujuran rasa, bukan semata-mata mengejar pengakuan luar.`;
  } else {
    secaraUmumP2 = `Dalam berinteraksi dengan dinamika hidup, perpaduan karakter ini diperkuat oleh kualitas ${arcana.quality}. ${weton ? `Nuansa rasa dari weton kelahiran ${weton} turut memperhalus caramu merespons keadaan, membantumu menjaga harmoni dengan orang-orang di sekitarmu tanpa harus kehilangan jati diri pribadi.` : `Kamu cenderung merespons situasi melalui pertimbangan batin yang matang, mengutamakan kenyamanan rasa sebelum memutuskan langkah nyata.`}`;
  }

  const secaraUmumP3 = `Namun, setiap kekuatan naturally membawa sisi bayang-bayangnya sendiri. Hal yang mungkin sesekali perlu kamu perhatikan secara sadar adalah ${lp.blindspot}. Pola ini sering kali muncul tanpa kamu sadari saat kamu merasa sangat peduli pada hasil akhir. Menyadari kecenderungan ini sejak dini akan membantumu terhindar dari rasa lelah mental yang berlebihan.`;

  const secaraUmumP4 = `Pada akhirnya, mengenali diri bukanlah upaya membatasi potensi dalam kotak-kotak sempit, melainkan memahami bagaimana caramu bekerja dan pulang ke titik seimbang. Luangkan waktu untuk memberi jeda di sela-sela kesibukanmu, hargai setiap fase belajar yang sedang berjalan, dan percayalah bahwa setiap langkah kecil yang kamu ambil dengan penuh kesadaran akan membawamu ke arah yang semakin membumi.`;

  // ----------------------------------------------------
  // 2. EKONOMI & KARIER (3-4 Paragraf)
  // ----------------------------------------------------
  const ekonomiP1 = `Di area karya, profesionalisme, dan mata pencaharian, potensi terbaikmu cenderung mekar saat kamu berada di lingkungan yang menghargai integritas dan nilai nyata. Berdasarkan Life Path ${lpNum}, kamu ${lp.workStyle}. Ditunjang oleh karakter ${arcana.careerInsight}, kamu memiliki kemampuan alami untuk membangun kepercayaan jangka panjang dengan rekanan maupun atasan.`;

  const ekonomiP2 = `Dalam hal pengelolaan finansial dan sumber daya materi, ${lp.financialMindset}. ${baziElement ? `Elemen ${baziElement} pada pilar harimu mengingatkan pentingnya menjaga arus kas yang sehat dan mengutamakan alokasi aset yang berkelanjutan daripada spekulasi jangka pendek yang menguras energi.` : `Membangun pos tabungan yang terstruktur dan menjaga gaya hidup tetap berimbang adalah fondasi utama yang akan memberimu ketenangan pikiran dalam berkarya.`}`;

  const ekonomiP3 = `Tantangan profesional yang paling sering menguji kesabaranmu adalah ${lp.workChallenge}. Ketika tekanan tenggat waktu atau ekspektasi pasar sedang tinggi, penting untuk mengingat kembali prioritas terpentingmu dan berani mendelegasikan hal-hal teknis yang memang bisa dikerjakan bersama orang lain.`;

  let ekonomiP4 = '';
  if (enrichedTransits.career.length > 0) {
    const ct = enrichedTransits.career[0];
    ekonomiP4 = `Mengenai atmosfer saat ini, dinamika langit menunjukkan ${ct.title}. Secara reflektif, suasana ini menghadirkan momentum yang baik untuk ${ct.reflection} Luangkan waktu untuk meninjau kembali kesepakatan kerja, merapikan administrasi keuangan, dan memastikan setiap komitmen profesionalmu berpijak pada fondasi yang kokoh.`;
  } else if (enrichedTransits.retrogrades.some((r) => r.name === 'Merkurius' || r.name === 'Saturnus')) {
    ekonomiP4 = `Secara astrologis, saat ini beberapa planet sedang berada dalam fase gerak mundur semu (retrograde). Di area karier, ini adalah pengingat yang baik untuk memeriksa kembali dokumen penting, tidak tergesa-gesa menandatangani kontrak baru tanpa ketelitian ekstra, dan mematangkan strategi yang sudah ada sebelum meluncurkan inisiatif berskala besar.`;
  } else {
    ekonomiP4 = `Ritme langit saat ini mendukung konsistensi dan penyempurnaan karya yang sedang berjalan. Jaga fokusmu pada proyek-proyek yang membawa manfaat nyata, rawat relasi profesional dengan komunikasi yang hangat, dan biarkan reputasimu bertumbuh melalui bukti kerja nyata yang konsisten.`;
  }

  // ----------------------------------------------------
  // 3. ASMARA & RELASI (Single & Pasangan)
  // ----------------------------------------------------
  // Asmara — Single (2-3 Paragraf)
  const asmaraSingleP1 = `${lp.loveSingle} ${arcana.loveInsight}. Kamu cenderung membutuhkan koneksi yang dimulai dari percakapan yang jujur dan rasa saling menghargai ruang pribadi, bukan hubungan yang dibangun di atas ketergesa-gesaan atau tuntutan status semata.`;

  const asmaraSingleP2 = `Ketika kamu mulai tertarik pada seseorang, perhatikan bagaimana caramu merespons dinamika awal perkenalan. Beri waktu bagi karakter aslinya untuk terlihat secara wajar melalui tindakannya sehari-hari. Mengembangkan relasi yang sehat selalu dimulai dari rasa utuh dengan diri sendiri, sehingga kamu tidak mencari pasangan untuk melengkapi kekurangan, melainkan untuk berbagi kebahagiaan yang sudah kamu miliki.`;

  let asmaraSingleP3 = '';
  if (enrichedTransits.love.length > 0) {
    const lt = enrichedTransits.love[0];
    asmaraSingleP3 = `Secara simbolis, suasana langit saat ini yang dinaungi ${lt.title} mengajakmu untuk ${lt.reflection} Jadikan masa ini sebagai ruang yang tenang untuk memperjelas apa yang sesungguhnya kamu butuhkan dari sebuah komitmen jangka panjang.`;
  } else {
    asmaraSingleP3 = `Tetaplah terbuka pada perjumpaan-perjumpaan baru tanpa membebani dirimu dengan ekspektasi yang kaku. Ketika kamu merasa damai dan nyaman dengan dirimu sendiri, kamu secara alami akan memancarkan daya tarik yang tulus bagi orang yang tepat.`;
  }

  // Asmara — Memiliki Pasangan (2-3 Paragraf)
  const asmaraCoupleP1 = `${lp.loveCouple} Dalam dinamika keseharian bersama pasangan, ${arcana.loveInsight}. Hubunganmu akan terasa paling hangat saat kalian berdua membiasakan diri untuk saling mendengarkan tanpa langsung memotong atau memberi penghakiman ketika ada hal yang terasa mengganjal.`;

  const asmaraCoupleP2 = `Tantangan yang kerap muncul dalam relasi panjang biasanya berkisar pada kejenuhan rutinitas atau kebiasaan menahan unek-unek kecil hingga menumpuk. Luangkan waktu untuk melakukan hal-hal sederhana berdua di luar pembicaraan tentang urusan domestik atau tanggung jawab praktis. Saling memberi ruang bernapas secara mandiri justru akan mempererat kelekatan emosional kalian saat kembali bersama.`;

  let asmaraCoupleP3 = '';
  if (enrichedTransits.love.length > 0) {
    const lt = enrichedTransits.love[0];
    asmaraCoupleP3 = `Terkait kondisi saat ini, ${lt.title} mengingatkan bahwa ${lt.reflection} Gunakan kesempatan ini untuk menyegarkan kembali apresiasi terhadap pasangan dan menyelesaikan hal-hal yang tertunda dengan kelembutan tutur kata.`;
  } else {
    asmaraCoupleP3 = `Merawat cinta adalah seni merawat hal-hal kecil setiap hari: ucapan terima kasih yang tulus, pelukan hangat sebelum beraktivitas, dan kesediaan untuk saling memaafkan kesalahan-kesalahan kecil dengan lapang dada.`;
  }

  // ----------------------------------------------------
  // 4. KESEHATAN (2-3 Paragraf)
  // ----------------------------------------------------
  const kesehatanP1 = `Dalam menjaga vitalitas dan kebugaran tubuh, penting untuk dipahami bahwa catatan ini bukanlah diagnosis medis, melainkan panduan reflektif untuk mendengar sinyal alami tubuhmu. Berdasarkan cetak biru energimu, ${lp.healthFocus} ${hd ? hd.rest : 'Tubuhmu membutuhkan ritme istirahat yang seimbang agar energi fisik dan kejernihan pikiran tetap terjaga prima.'}`;

  const kesehatanP2 = `Kondisi fisikmu sangat erat kaitannya dengan beban pikiran dan suasana batin yang kamu simpan. Saat pikiran sedang terlalu padat atau kamu menahan ketegangan emosional, tubuh biasanya merespons melalui ketegangan otot bahu, gangguan lambung, atau kualitas tidur yang berkurang. Membiasakan jeda sejenak untuk menarik napas dalam secara teratur adalah langkah sederhana yang sangat efektif untuk merilekskan sistem sarafmu.`;

  const kesehatanP3 = `Sebagai langkah perawatan harian yang membumi, utamakan hal-hal mendasar: minum air putih yang cukup sepanjang hari, mengonsumsi makanan yang bernutrisi seimbang, dan meluangkan waktu setidaknya 15–30 menit untuk bergerak aktif atau berjalan santai di udara terbuka. Menghindari paparan layar gawai menjelang waktu tidur akan sangat membantumu mendapatkan istirahat malam yang benar-benar memulihkan daya hidup.`;

  // ----------------------------------------------------
  // 5. SPIRITUAL (3-4 Paragraf)
  // ----------------------------------------------------
  const spiritualP1 = `Pencarian spiritual bagimu bukanlah pelarian dari realitas duniawi, melainkan seni menemukan makna dan kedamaian di tengah kehidupan sehari-hari. Berdasarkan perpaduan Life Path ${lpNum} dan Arcana ${arcanaName}, ${lp.spiritualTheme} ${arcana.spiritualInsight}. Ada kerinduan alami di dalam jiwamu untuk memahami hukum-hukum kehidupan yang lebih mendalam dan hidup dengan integritas yang utuh.`;

  const spiritualP2 = `Dalam tradisi Bhumi Amartya, spiritualitas dipahami sebagai kehadiran yang penuh kesadaran (mindfulness) dalam setiap tindakan: bagaimana caramu memperlakukan sesama, menjaga kebersihan niat dalam berkarya, dan menerima pasang surut nasib dengan ketenangan batin. Kamu tidak perlu mencari pengalaman batin yang rumit; ketulusan menjalankan peran hidupmu saat ini sudah merupakan laku spiritual yang sangat luhur.`;

  let spiritualP3 = '';
  if (vedic && vedic.nakshatra) {
    spiritualP3 = `Berdasarkan tradisi Vedic Astrology, jiwamu bernaung di bawah energi Nakshatra ${vedic.nakshatra} (Pada ${vedic.pada || 1}). ${vedic.currentMahadasha ? `Saat ini kamu sedang melintasi periode Mahadasha ${vedic.currentMahadasha.planet}, yang secara simbolis menandai fase pembelajaran batin mengenai ketekunan, pematangan kedewasaan rasa, dan penataan ulang prioritas hidupmu.` : `Energi ini mengajakmu untuk memperdalam kepekaan batin dan menyelaraskan kehendak pribadi dengan arus bimbingan semesta.`}`;
  } else {
    spiritualP3 = `Saat kamu meluangkan waktu untuk duduk hening, bermeditasi, atau berdoa dengan tenang, kamu akan merasakan betapa batinmu memiliki kapasitas besar untuk pulih dari kepenatan. Percayalah pada bisikan nuranimu yang tenang, terutama ketika logika pikiran terasa buntu menghadapi banyak pilihan.`;
  }

  let spiritualP4 = '';
  if (currentSky) {
    spiritualP4 = `Di bawah naungan langit hari ini—di mana Bulan sidereal berada di rashi ${currentSky.moon.rashi.name} dan dinaungi Nakshatra ${currentSky.moon.nakshatra.name}—kamu diajak untuk melatih kepasrahan yang aktif. Merelakan hal-hal yang berada di luar kendalimu bukanlah tanda kelemahan, melainkan wujud kebijaksanaan tertinggi yang membebaskan jiwamu dari beban rasa cemas.`;
  } else {
    spiritualP4 = `Jadikan setiap perjumpaan dan peristiwa hari ini sebagai cermin untuk mengenal diri lebih dekat. Di sanalah letak kedamaian sejati: ketika kamu mampu menerima dirimu seutuhnya dan berjalan dengan penuh rasa syukur.`;
  }

  // ----------------------------------------------------
  // 6. TANTANGAN (3-4 Paragraf)
  // ----------------------------------------------------
  const tantanganP1 = `Setiap fase pertumbuhan hidup selalu diiringi oleh area-area gesekan yang menuntut kesabaran dan kedewasaan respons. Tantangan utama yang paling sering muncul dari cetak biru ini adalah ${lp.challengeCore} ${hd ? hd.challenge : 'Ketika situasi berjalan tidak sesuai rencana atau orang lain tidak merespons seperti yang kamu harapkan, ada kecenderungan spontan untuk merasa tegang atau menarik diri.'}`;

  const tantanganP2 = `Pola reaktif yang perlu kamu sadari adalah ${arcana.challengeInsight}. Saat berada di bawah tekanan tinggi, pikiran rasionalmu bisa sangat cepat menyusun skenario kekhawatiran yang belum tentu terjadi di dunia nyata. Menyadari reaksi awal ini sebelum kamu bertindak atau berbicara akan menyelamatkanmu dari konflik yang tidak perlu.`;

  let tantanganP3 = '';
  if (enrichedTransits.challenge.length > 0) {
    const cht = enrichedTransits.challenge[0];
    tantanganP3 = `Secara astrologis, saat ini terdapat pengaruh ${cht.title}. Penting untuk dipahami bahwa ini bukanlah pertanda kesialan atau takdir buruk, melainkan fase penguatan mental. Pengaruh langit ini secara simbolis mengajakmu untuk ${cht.reflection} Hadapi setiap hambatan sebagai ruang latihan untuk memperkuat ketahanan batinmu.`;
  } else if (enrichedTransits.retrogrades.length > 0) {
    const retCount = enrichedTransits.retrogrades.length;
    const retList = enrichedTransits.retrogrades.slice(0, 3).map((r) => r.name).join(', ');
    tantanganP3 = `Adanya ${retCount} planet yang sedang retrograde saat ini (${retList}) membawa nuansa perlambatan semu. Tantangan terbesarmu saat ini adalah tidak memaksakan hasil serbainstan. Hargai proses perbaikan, dengarkan masukan yang konstruktif, dan izinkan segala sesuatu matang pada waktunya.`;
  } else {
    tantanganP3 = `Ujian terbesarmu sering kali bukan datang dari rintangan di luar, melainkan dari standar kesempurnaan yang kamu bebankan pada dirimu sendiri. Belajarlah berdamai dengan ketidaksempurnaan dan berikan apresiasi pada setiap pencapaian kecil yang telah berhasil kamu selesaikan.`;
  }

  const tantanganP4 = `Kunci untuk melewati setiap tantangan adalah kembali ke hal-hal membumi: luangkan waktu untuk bernapas panjang, bicarakan beban pikiranmu dengan sahabat atau mentor yang kamu percayai, dan fokuskan energi hanya pada satu hal yang bisa kamu kendalikan hari ini. Kamu memiliki ketangguhan yang cukup untuk melewati setiap musim hidupmu.`;

  // ----------------------------------------------------
  // CURRENT SKY SUMMARY CARD (Peta Langit Saat Ini)
  // ----------------------------------------------------
  let skySection = null;
  if (currentSky) {
    const calculationDateFormatted = new Date(currentSky.calculationTime).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const currentMoonRashi = currentSky.moon.rashi.name;
    const currentMoonNak = currentSky.moon.nakshatra.name;
    const currentMoonPada = currentSky.moon.nakshatra.pada;

    const retrogrades = currentSky.activeRetrogrades || [];
    let retrogradeNarrative = '';
    if (retrogrades.length > 0) {
      const retSummary = retrogrades.map((r) => `${r.name || r.indonesianName} di ${r.rashi.name}`).join(', ');
      retrogradeNarrative = `Saat ini terkonfirmasi ${retrogrades.length} planet dalam fase gerak mundur semu (retrograde): ${retSummary}. Secara astrologis reflektif, masa ini mengajak kita meninjau kembali keputusan, memeriksa komunikasi, dan tidak terburu-buru mengambil kesimpulan akhir.`;
    } else {
      retrogradeNarrative = `Saat ini seluruh planet utama bergerak maju (direct), mendukung kelancaran komunikasi dan eksekusi rencana-rencana yang telah matang.`;
    }

    const primaryTransits = personalTransits?.primaryTransits || [];
    const topTransits = primaryTransits.slice(0, 3).map((t) => ({
      planet: t.indonesianName || t.planet,
      title: t.title,
      tag: t.tag,
      reflection: t.reflection
    }));

    const monthlyTheme = `Bulan ini didominasi oleh pergerakan Bulan sidereal di rashi ${currentMoonRashi} (${currentMoonNak}), mengajak kita menyelaraskan ritme kerja dengan keheningan batin serta menuntaskan apa yang telah dimulai.`;

    let precisionNote = '';
    if (isPartial) {
      precisionNote = 'Catatan: Karena jam atau kota lahir tidak dicantumkan secara lengkap, posisi Ascendant (Lagna) dan rumah astrologi tidak dihitung secara spekulatif. Refleksi transit di atas difokuskan pada relasi langit saat ini dengan posisi Matahari kelahiranmu.';
    }

    skySection = {
      title: 'Peta Langit Saat Ini',
      calculationDate: calculationDateFormatted,
      calculationTimeIso: currentSky.calculationTime,
      currentMoon: {
        rashi: currentMoonRashi,
        nakshatra: currentMoonNak,
        pada: currentMoonPada
      },
      moonReflection: `Hari ini Bulan sidereal berada di rashi ${currentMoonRashi}, dinaungi Nakshatra ${currentMoonNak} (Pada ${currentMoonPada}).`,
      monthlyTheme,
      retrogradeNarrative,
      activeRetrogrades: retrogrades.map((r) => ({
        name: r.name || r.indonesianName,
        rashi: r.rashi.name,
        startDate: r.retrogradeWindow?.startDate || null,
        endDate: r.retrogradeWindow?.endDate || null
      })),
      transits: topTransits,
      precisionNote
    };
  }

  return {
    nickname: safeName,
    header: {
      greeting: `Halo, ${safeName}`,
      intro: `Berikut adalah pembacaan blueprint dirimu yang dirangkai secara personal, hangat, dan membumi berdasarkan sintesis tanggal lahir dan kondisi langit terkini.`
    },
    currentSky: skySection,
    categories: {
      secaraUmum: {
        id: 'secara-umum',
        title: '1. Secara Umum',
        order: 1,
        paragraphs: [secaraUmumP1, secaraUmumP2, secaraUmumP3, secaraUmumP4]
      },
      ekonomiKarier: {
        id: 'ekonomi-karier',
        title: '2. Ekonomi & Karier',
        order: 2,
        paragraphs: [ekonomiP1, ekonomiP2, ekonomiP3, ekonomiP4]
      },
      asmara: {
        id: 'asmara',
        title: '3. Asmara',
        order: 3,
        single: [asmaraSingleP1, asmaraSingleP2, asmaraSingleP3],
        couple: [asmaraCoupleP1, asmaraCoupleP2, asmaraCoupleP3]
      },
      kesehatan: {
        id: 'kesehatan',
        title: '4. Kesehatan',
        order: 4,
        paragraphs: [kesehatanP1, kesehatanP2, kesehatanP3]
      },
      spiritual: {
        id: 'spiritual',
        title: '5. Spiritual',
        order: 5,
        paragraphs: [spiritualP1, spiritualP2, spiritualP3, spiritualP4]
      },
      tantangan: {
        id: 'tantangan',
        title: '6. Tantangan',
        order: 6,
        paragraphs: [tantanganP1, tantanganP2, tantanganP3, tantanganP4]
      }
    },
    closing: {
      title: 'Pesan untuk Dirimu Saat Ini',
      text: lp.closing
    },
    sections: {
      greeting: {
        title: `Halo, ${safeName}`,
        intro: `Berikut adalah pembacaan blueprint dirimu yang dirangkai secara personal, hangat, dan membumi berdasarkan sintesis tanggal lahir dan kondisi langit terkini.`
      },
      secaraUmum: {
        title: '1. Secara Umum',
        paragraphs: [secaraUmumP1, secaraUmumP2, secaraUmumP3, secaraUmumP4]
      },
      ekonomiKarier: {
        title: '2. Ekonomi & Karier',
        paragraphs: [ekonomiP1, ekonomiP2, ekonomiP3, ekonomiP4]
      },
      asmara: {
        title: '3. Asmara',
        single: [asmaraSingleP1, asmaraSingleP2, asmaraSingleP3],
        couple: [asmaraCoupleP1, asmaraCoupleP2, asmaraCoupleP3]
      },
      kesehatan: {
        title: '4. Kesehatan',
        paragraphs: [kesehatanP1, kesehatanP2, kesehatanP3]
      },
      spiritual: {
        title: '5. Spiritual',
        paragraphs: [spiritualP1, spiritualP2, spiritualP3, spiritualP4]
      },
      tantangan: {
        title: '6. Tantangan',
        paragraphs: [tantanganP1, tantanganP2, tantanganP3, tantanganP4]
      },
      patterns: {
        title: 'Mengenal Pola Dirimu',
        paragraphs: [secaraUmumP1, secaraUmumP2, secaraUmumP3]
      },
      dailyLife: {
        title: 'Hubungan, Aktivitas, dan Keseharian',
        items: [
          { title: 'Ekonomi & Karier', text: ekonomiP1 },
          { title: 'Asmara & Relasi', text: asmaraCoupleP1 },
          { title: 'Kesehatan & Vitalitas', text: kesehatanP1 }
        ]
      },
      currentSky: skySection,
      closing: {
        title: 'Pesan untuk Dirimu Saat Ini',
        text: lp.closing
      }
    }
  };
}
