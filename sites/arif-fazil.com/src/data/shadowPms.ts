/**
 * PM Bayang — Shadow Prime Ministers of Malaysia
 * Jungian shadow analysis of every Malaysian Prime Minister.
 * DITEMPA BUKAN DIBERI — Forged, Not Given.
 */

export interface ShadowPM {
  id: string;
  order: number;
  name: string;
  title: string;           // Tun, Tan Sri, Dato' Seri, etc.
  tenure: string;          // "1957–1970"
  portraitUrl: string;     // URL to portrait image
  persona: string;         // The public mask
  bayang: string;          // The hidden shadow
  tragedy: string;         // Where the shadow won
  legacy: string;          // One-line verdict
  verdict: 'TERSEDAR' | 'SAMAR' | 'TENGGELAM';  // Consciousness level
}

export const SHADOW_PMS: ShadowPM[] = [
  {
    id: 'tunku-abdul-rahman',
    order: 1,
    name: 'Tunku Abdul Rahman',
    title: 'Tunku',
    tenure: '1957–1970',
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Tunku_abd_rahman_%28cropped%2C_4to3_port%2C_bypass%29.jpg',
    persona: 'Bapa Kemerdekaan — putera raja Kedah yang lembut, merdeka tanpa darah, suka kuda dan bola.',
    bayang: 'Terlalu percaya pada British model. Merdeka politik tapi ekonomi kekal di tangan asing. Tak pernah benar-benar pimpin Melayu luar bandar — dia pimpin elit bandar yang cakap Inggeris.',
    tragedy: '13 Mei 1969 — rusuhan kaum yang dia tak nampak datang. Sistem yang dia bina retak atas race line yang dia anggap dah settle.',
    legacy: 'Dia bagi kita merdeka. Tapi bayang dia: satu negara yang merdeka di atas kertas, hamba di segi ekonomi.',
    verdict: 'SAMAR'
  },
  {
    id: 'tun-abdul-razak',
    order: 2,
    name: 'Tun Abdul Razak',
    title: 'Tun',
    tenure: '1970–1976',
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Tun_Abdul_Razak_1968.jpg',
    persona: 'Bapa Pembangunan — teknokrat bisu, bina FELDA, DEB, sekolah asrama. Workaholic yang tak cakap banyak.',
    bayang: 'DEB yang dia bina bukan sekadar ekonomi — ia jadi senjata politik kaum. Yang dia tak jangka: sistem kuota melahirkan budaya bergantung, bukan budaya bersaing. Dan bila UMNO guna DEB untuk kroni, Razak dah takde nak jawab.',
    tragedy: 'Dia meninggal 1976 di London — leukemia. Cepat sangat. DEB tinggal setengah siap dan akhirnya jadi alat pembahagian, bukan pembangunan.',
    legacy: 'Visi dia besar. Tapi pelaksanaan — lepas dia mati — jadi najis. Bukan salah dia. Tapi bayang dia hidup 50 tahun.',
    verdict: 'SAMAR'
  },
  {
    id: 'tun-hussein-onn',
    order: 3,
    name: 'Tun Hussein Onn',
    title: 'Tun',
    tenure: '1976–1981',
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/en/1/12/Tun_Hussein_Onn.jpg',
    persona: 'Bapa Perpaduan — askar jujur, bersih, tak tahan rasuah. PM paling pendek tapi paling bersih rekod.',
    bayang: 'Dia PM yang tak nak jadi PM. Ditolak ke atas sebab Razak mati. Kesepian dalam kuasa — dia lawan rasuah tapi kena tikam dari dalam UMNO sendiri. Dia tahu permainan kotor tapi tak cukup kuat nak bersihkan.',
    tragedy: 'Sakit jantung. Letak jawatan 1981. Lepas dia pergi — Mahathir ambil alih. Dan Mahathir buat apa yang Hussein tak boleh: main kotor untuk kekal.',
    legacy: 'Dia contoh pemimpin bersih. Tapi bayang dia: yang bersih tak bertahan. Yang kotor kekal.',
    verdict: 'TERSEDAR'
  },
  {
    id: 'tun-mahathir',
    order: 4,
    name: 'Tun Dr. Mahathir Mohamad',
    title: 'Tun Dr.',
    tenure: '1981–2003 · 2018–2020',
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Mahathir_Mohamad_13112018_%28cropped%29.jpg',
    persona: 'Bapa Pemodenan — doktor kampung jadi arkitek negara. Ubah Malaysia dari sawah ke pencakar langit. 22 tahun kuasa.',
    bayang: 'Dia percaya dia saja yang betul. Semua orang lain bodoh. Bila sistem tak ikut dia, dia ubah sistem. Bila hakim lawan, dia buang hakim. Bila parti lawan, dia kunci. Semua atas nama "pembangunan." Bayang Mahathir: megalomania bersalut nasionalisme.',
    tragedy: 'Dua kali dia pilih pengganti — dua kali dia jatuhkan mereka (Anwar 1998, Najib 2015). Setiap pengganti dia anggap tak layak. Sebab dalam kepala dia: hanya Mahathir yang layak pimpin Malaysia.',
    legacy: 'Dia bina Menara. Tapi robohkan institusi. Doktor yang menyembuh, kemudian memotong. PM paling lama, PM paling banyak parut.',
    verdict: 'TENGGELAM'
  },
  {
    id: 'tun-abdullah-badawi',
    order: 5,
    name: 'Tun Abdullah Ahmad Badawi',
    title: 'Tun',
    tenure: '2003–2009',
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Abdullah_Ahmad_Badawi_at_the_XIVth_Non-Aligned_Movement_Summit_at_Havana%2C_Cuba_on_September_16%2C_2006.jpg',
    persona: 'Bapa Islam Hadhari — Pak Lah yang lembut, bersih, soleh, dengan misi membaiki kerosakan Mahathir.',
    bayang: 'Dia mahu bersih tapi tak mampu lawan UMNO. Dia lepaskan ISA, buka ruang — tapi UMNO dan keluarganya sendiri (Khairy, menantu) dan kroni (Patrick Badawi) guna kuasa dia. Dia jadi PM tapi tak pernah benar-benar pegang stereng.',
    tragedy: 'PRU 2008. BN kalah 5 negeri, kehilangan 2/3 majoriti Parlimen. Tsunami politik yang dia tak jangka — sebab tersepit antara reformasi dan UMNO.',
    legacy: 'Orang baik. Tapi jadi PM bukan kerja orang baik. Bayang dia: kau boleh niat baik, tapi kalau kau tak kuat, kau jadi alat orang kuat.',
    verdict: 'SAMAR'
  },
  {
    id: 'dato-sri-najib',
    order: 6,
    name: 'Dato\' Sri Mohd Najib Razak',
    title: 'Dato\' Sri',
    tenure: '2009–2018',
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/Najib_Razak_2008-08-21.jpg',
    persona: 'Bapa Transformasi — anak Razak, Oxford-educated, transformasi digital, 1MDB sebelum gelap.',
    bayang: '1MDB — USD 4.5 billion. Skandal terbesar dalam sejarah Malaysia. Bukan sekadar curi duit — ia pendedahan bahawa sistem Malaysia dibina atas lubang. Dan Najib adalah result logik sistem tu: anak PM, dibesarkan dalam kuasa, tak pernah kena "tidak."',
    tragedy: '2018 — BN kalah. Pertama kali dalam sejarah Malaysia. Najib dari PM ke banduan. Isteri, Rosmah, sama. Bayang dia: bila kau tak boleh membezakan duit negara dengan duit sendiri.',
    legacy: 'Dia buktikan: sistem yang Mahathir bina boleh ditumbangkan. Tapi dia juga buktikan: bila anak sistem dapat kuasa, dia akan minum sistem tu sampai habis.',
    verdict: 'TENGGELAM'
  },
  {
    id: 'tan-sri-muhyiddin',
    order: 7,
    name: 'Tan Sri Muhyiddin Yassin',
    title: 'Tan Sri',
    tenure: '2020–2021',
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/98/Muhyiddin_Yassin_%2851087589446%29_%28cropped%29.jpg',
    persona: 'Abah — PM waktu COVID, bersih, muhibah, bukan pilihan raya.',
    bayang: 'Dia ambil kuasa bukan melalui pilihan raya — tapi melalui langkah Sheraton. Lompat parti. Pintu belakang. Dia tahu. Semua orang tahu. Tapi dia pura-pura "mandat." Bayang Muhyiddin: kuasa tanpa legitimacy.',
    tragedy: '17 bulan je. Ditolak oleh UMNO sendiri — parti yang dia membantu rompak kerajaan PH. Mati di tangan kawan.',
    legacy: 'PM paling singkat. Tapi paling penting: dia buktikan sesiapa pun boleh jadi PM — tanpa pilihan raya. Bayang dia: Malaysia selepas Muhyiddin, PM tak perlu menang.',
    verdict: 'TENGGELAM'
  },
  {
    id: 'dato-sri-ismail-sabri',
    order: 8,
    name: 'Dato\' Sri Ismail Sabri Yaakob',
    title: 'Dato\' Sri',
    tenure: '2021–2022',
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Ismail_Sabri_Yaakob_01042022_%28cropped%29.jpg',
    persona: 'Keluarga Malaysia — PM kejutan, budak Temerloh yang naik, cuba damaikan politik.',
    bayang: 'Dia tak sepatutnya jadi PM. Dia naik sebab semua orang lain penat gaduh. Muhyiddin tumbang, Ismail jadi ganti — bukan sebab hebat, tapi sebab dia pilihan paling tak controversial. PM default. Bayang Ismail: kau boleh jadi PM Malaysia bukan kerana kau layak, tapi kerana semua orang lain terlalu letih untuk terus bergaduh.',
    tragedy: '14 bulan je. PH + BN + PN semua tunggu dia jatuh. Dan dia tahu. Setiap hari dia PM, dia tahu dia dipinjamkan kuasa.',
    legacy: 'Dia buktikan sistem dah rosak teruk — PM boleh jadi sesiapa, tak perlu menang pilihan raya. Bayang dia: "Keluarga Malaysia" tapi keluarganya sendiri — UMNO — yang bunuh dia.',
    verdict: 'SAMAR'
  },
  {
    id: 'dato-seri-anwar',
    order: 9,
    name: 'Dato\' Seri Anwar Ibrahim',
    title: 'Dato\' Seri',
    tenure: '2022–sekarang',
    portraitUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c1/Anwar_Ibrahim_in_June_2026.jpg',
    persona: 'Reformis yang akhirnya jadi PM — pejuang demokrasi yang masuk penjara, bangkit, dan naik takhta.',
    bayang: 'Dia lawan zalim 20 tahun tapi bila dapat kuasa, dia tak ubah sistem — dia pakai sistem yang sama. UMNO yang dia lawan, sekarang jadi kawan sekantor. Bayang Anwar: persona reformis terlalu cantik sampai bayang dia tak pernah dihadapi. Dia tak pernah cakap "saya silap." Semua konspirasi. Semua orang lain salah.',
    tragedy: '30 tahun tunggu PM. Bila dapat — dah terlambat. Negara dah retak, lawan dah banyak, ekonomi dah parah. Dan yang paling perit: orang yang dia lawan dulu (Mahathir, UMNO) adalah orang yang dia perlukan sekarang.',
    legacy: 'Masih menulis. Tapi bayang dia: pemimpin yang tak jumpa bayang sendiri. Dulu lawan sistem — sekarang sistem tu jadi dia.',
    verdict: 'TENGGELAM'
  }
];
