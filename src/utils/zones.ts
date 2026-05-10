export interface Zone {
  value: string
  label: string
  state: string
}

export interface ZoneGroup {
  state: string
  zones: Zone[]
}

export const ZONE_GROUPS: ZoneGroup[] = [
  {
    state: 'Johor',
    zones: [
      { value: 'JHR01', label: 'JHR01 - Pulau Aur dan Pulau Pemanggil', state: 'Johor' },
      { value: 'JHR02', label: 'JHR02 - Johor Bahru, Kota Tinggi, Mersing, Kulai', state: 'Johor' },
      { value: 'JHR03', label: 'JHR03 - Kluang, Pontian', state: 'Johor' },
      { value: 'JHR04', label: 'JHR04 - Batu Pahat, Muar, Segamat, Gemas Johor, Tangkak', state: 'Johor' },
    ],
  },
  {
    state: 'Kedah',
    zones: [
      { value: 'KDH01', label: 'KDH01 - Kota Setar, Kubang Pasu, Pokok Sena', state: 'Kedah' },
      { value: 'KDH02', label: 'KDH02 - Kuala Muda, Yan, Pendang', state: 'Kedah' },
      { value: 'KDH03', label: 'KDH03 - Padang Terap, Sik', state: 'Kedah' },
      { value: 'KDH04', label: 'KDH04 - Baling', state: 'Kedah' },
      { value: 'KDH05', label: 'KDH05 - Bandar Baharu, Kulim', state: 'Kedah' },
      { value: 'KDH06', label: 'KDH06 - Langkawi', state: 'Kedah' },
      { value: 'KDH07', label: 'KDH07 - Puncak Gunung Jerai', state: 'Kedah' },
    ],
  },
  {
    state: 'Kelantan',
    zones: [
      { value: 'KTN01', label: 'KTN01 - Bachok, Kota Bharu, Machang, Pasir Mas, Pasir Puteh, Tanah Merah, Tumpat, Kuala Krai', state: 'Kelantan' },
      { value: 'KTN02', label: 'KTN02 - Gua Musang (Daerah Galas Dan Bertam), Jeli, Lojing', state: 'Kelantan' },
    ],
  },
  {
    state: 'Melaka',
    zones: [
      { value: 'MLK01', label: 'MLK01 - Seluruh Negeri Melaka', state: 'Melaka' },
    ],
  },
  {
    state: 'Negeri Sembilan',
    zones: [
      { value: 'NGS01', label: 'NGS01 - Tampin, Jempol', state: 'Negeri Sembilan' },
      { value: 'NGS02', label: 'NGS02 - Jelebu, Kuala Pilah, Rembau', state: 'Negeri Sembilan' },
      { value: 'NGS03', label: 'NGS03 - Port Dickson, Seremban', state: 'Negeri Sembilan' },
    ],
  },
  {
    state: 'Pahang',
    zones: [
      { value: 'PHG01', label: 'PHG01 - Pulau Tioman', state: 'Pahang' },
      { value: 'PHG02', label: 'PHG02 - Kuantan, Pekan, Muadzam Shah', state: 'Pahang' },
      { value: 'PHG03', label: 'PHG03 - Jerantut, Temerloh, Maran, Bera, Chenor, Jengka', state: 'Pahang' },
      { value: 'PHG04', label: 'PHG04 - Bentong, Lipis, Raub', state: 'Pahang' },
      { value: 'PHG05', label: 'PHG05 - Genting Sempah, Janda Baik, Bukit Tinggi', state: 'Pahang' },
      { value: 'PHG06', label: 'PHG06 - Cameron Highlands, Genting Highlands, Bukit Fraser', state: 'Pahang' },
      { value: 'PHG07', label: 'PHG07 - Zon Khas Daerah Rompin', state: 'Pahang' },
    ],
  },
  {
    state: 'Perlis',
    zones: [
      { value: 'PLS01', label: 'PLS01 - Kangar, Padang Besar, Arau', state: 'Perlis' },
    ],
  },
  {
    state: 'Pulau Pinang',
    zones: [
      { value: 'PNG01', label: 'PNG01 - Seluruh Negeri Pulau Pinang', state: 'Pulau Pinang' },
    ],
  },
  {
    state: 'Perak',
    zones: [
      { value: 'PRK01', label: 'PRK01 - Tapah, Slim River, Tanjung Malim', state: 'Perak' },
      { value: 'PRK02', label: 'PRK02 - Kuala Kangsar, Sg. Siput, Ipoh, Batu Gajah, Kampar', state: 'Perak' },
      { value: 'PRK03', label: 'PRK03 - Lenggong, Pengkalan Hulu, Grik', state: 'Perak' },
      { value: 'PRK04', label: 'PRK04 - Temengor, Belum', state: 'Perak' },
      { value: 'PRK05', label: 'PRK05 - Kg Gajah, Teluk Intan, Bagan Datuk, Seri Iskandar, Beruas, Parit, Lumut, Sitiawan, Pulau Pangkor', state: 'Perak' },
      { value: 'PRK06', label: 'PRK06 - Selama, Taiping, Bagan Serai, Parit Buntar', state: 'Perak' },
      { value: 'PRK07', label: 'PRK07 - Bukit Larut', state: 'Perak' },
    ],
  },
  {
    state: 'Sabah',
    zones: [
      { value: 'SBH01', label: 'SBH01 - Bahagian Sandakan (Timur), Bukit Garam, Semawang, Temanggong, Bandar Sandakan', state: 'Sabah' },
      { value: 'SBH02', label: 'SBH02 - Beluran, Telupid, Pinangah, Terusan, Kuamut, Bahagian Sandakan (Barat)', state: 'Sabah' },
      { value: 'SBH03', label: 'SBH03 - Lahad Datu, Silabukan, Kunak, Sahabat, Semporna, Tungku', state: 'Sabah' },
      { value: 'SBH04', label: 'SBH04 - Bandar Tawau, Balong, Merotai, Kalabakan', state: 'Sabah' },
      { value: 'SBH05', label: 'SBH05 - Kudat, Kota Marudu, Pitas, Pulau Banggi', state: 'Sabah' },
      { value: 'SBH06', label: 'SBH06 - Gunung Kinabalu', state: 'Sabah' },
      { value: 'SBH07', label: 'SBH07 - Kota Kinabalu, Ranau, Kota Belud, Tuaran, Penampang, Papar', state: 'Sabah' },
      { value: 'SBH08', label: 'SBH08 - Pensiangan, Keningau, Tambunan, Nabawan', state: 'Sabah' },
      { value: 'SBH09', label: 'SBH09 - Beaufort, Kuala Penyu, Sipitang, Tenom, Long Pasia', state: 'Sabah' },
    ],
  },
  {
    state: 'Selangor',
    zones: [
      { value: 'SGR01', label: 'SGR01 - Gombak, Petaling, Sepang, Hulu Langat, Hulu Selangor, Shah Alam', state: 'Selangor' },
      { value: 'SGR02', label: 'SGR02 - Kuala Selangor, Sabak Bernam', state: 'Selangor' },
      { value: 'SGR03', label: 'SGR03 - Klang, Kuala Langat', state: 'Selangor' },
    ],
  },
  {
    state: 'Sarawak',
    zones: [
      { value: 'SWK01', label: 'SWK01 - Limbang, Lawas, Sundar, Trusan', state: 'Sarawak' },
      { value: 'SWK02', label: 'SWK02 - Miri, Niah, Bekenu, Sibuti, Marudi', state: 'Sarawak' },
      { value: 'SWK03', label: 'SWK03 - Pandan, Belaga, Suai, Tatau, Sebauh, Bintulu', state: 'Sarawak' },
      { value: 'SWK04', label: 'SWK04 - Sibu, Mukah, Dalat, Song, Igan, Oya, Balingian, Kanowit, Kapit', state: 'Sarawak' },
      { value: 'SWK05', label: 'SWK05 - Sarikei, Matu, Julau, Rajang, Daro, Bintangor, Belawai', state: 'Sarawak' },
      { value: 'SWK06', label: 'SWK06 - Lubok Antu, Sri Aman, Roban, Debak, Kabong, Lingga, Engkelili, Betong', state: 'Sarawak' },
      { value: 'SWK07', label: 'SWK07 - Serian, Simunjan, Samarahan, Sebuyau, Meludam', state: 'Sarawak' },
      { value: 'SWK08', label: 'SWK08 - Kuching, Bau, Lundu, Sematan', state: 'Sarawak' },
      { value: 'SWK09', label: 'SWK09 - Zon Khas (Kampung Patarikan)', state: 'Sarawak' },
    ],
  },
  {
    state: 'Terengganu',
    zones: [
      { value: 'TRG01', label: 'TRG01 - Kuala Terengganu, Marang, Kuala Nerus', state: 'Terengganu' },
      { value: 'TRG02', label: 'TRG02 - Besut, Setiu', state: 'Terengganu' },
      { value: 'TRG03', label: 'TRG03 - Hulu Terengganu', state: 'Terengganu' },
      { value: 'TRG04', label: 'TRG04 - Dungun, Kemaman', state: 'Terengganu' },
    ],
  },
  {
    state: 'Wilayah Persekutuan',
    zones: [
      { value: 'WLY01', label: 'WLY01 - Kuala Lumpur, Putrajaya', state: 'Wilayah Persekutuan' },
      { value: 'WLY02', label: 'WLY02 - Labuan', state: 'Wilayah Persekutuan' },
    ],
  },
]

export const ALL_ZONES: Zone[] = ZONE_GROUPS.flatMap(g => g.zones)

export function getZoneLabel(value: string): string {
  return ALL_ZONES.find(z => z.value === value)?.label ?? value
}

export function getZoneState(value: string): string {
  return ALL_ZONES.find(z => z.value === value)?.state ?? ''
}

export function getZoneDaerah(value: string): string {
  const label = ALL_ZONES.find(z => z.value === value)?.label ?? ''
  return label.split(' - ')[1] ?? label
}

export const DEFAULT_ZONE = 'WLY01'
