// ==================== DEMO ACCOUNTS GENERATOR ====================
// Generates 1000 realistic demo buyer accounts for admin dashboard
// Marked as DEMO (yellow badge) - only visible in admin, looks real to sellers

export interface DemoAccount {
  id: string
  name: string
  email: string
  phone: string
  role: 'user'
  joinDate: string
  password: string
  addresses: {
    id: string
    label: string
    name: string
    phone: string
    address: string
    city: string
    state: string
    zip: string
    country: string
    isDefault: boolean
  }[]
  coins: number
  membership: 'basic' | 'prime' | 'premium'
  browsingHistory: number[]
  isDemo: boolean
  demoCountry: string
}

const FIRST_NAMES: Record<string, string[]> = {
  'Indonesia': ['Budi', 'Siti', 'Ahmad', 'Dewi', 'Rizky', 'Putri', 'Andi', 'Rina', 'Dedi', 'Maya', 'Agus', 'Lestari', 'Hendra', 'Wati', 'Rudi', 'Ani', 'Bambang', 'Sri', 'Irfan', 'Nurul', 'Yoga', 'Fitri', 'Hadi', 'Ratna', 'Eko', 'Dian', 'Joko', 'Wulan', 'Fajar', 'Ayu', 'Rahmat', 'Sari', 'Tono', 'Lina', 'Imam', 'Reni', 'Dani', 'Mega', 'Adi', 'Citra'],
  'Malaysia': ['Ahmad', 'Siti', 'Muhammad', 'Nur', 'Ali', 'Fatimah', 'Hassan', 'Aminah', 'Ismail', 'Zainab', 'Rahman', 'Halim', 'Azman', 'Kamal', 'Faisal', 'Nadia', 'Amir', 'Lisa', 'Hafiz', 'Syafiq', 'Irfan', 'Aisyah', 'Danial', 'Nabilah', 'Farhan', 'Puteri', 'Ikmal', 'Sarah', 'Adam', 'Maisarah'],
  'Singapore': ['Wei Ming', 'Xin Yi', 'Hafiz', 'Nurul', 'Ravi', 'Priya', 'James', 'Sarah', 'David', 'Michelle', 'Kevin', 'Jasmine', 'Ryan', 'Amanda', 'Darren', 'Rachel', 'Jonathan', 'Victoria', 'Marcus', 'Stephanie', 'Nicholas', 'Charlotte', 'Daniel', 'Emily', 'Brandon', 'Olivia', 'Justin', 'Sophie', 'Kyle', 'Hannah'],
  'Thailand': ['Somchai', 'Somporn', 'Malee', 'Prasert', 'Nittaya', 'Sukhon', 'Wichai', 'Preecha', 'Kanya', 'Arthit', 'Siriporn', 'Chaiwat', 'Patchara', 'Narumon', 'Thanawat', 'Waraporn', 'Anurak', 'Kannika', 'Phichai', 'Rattana', 'Suwat', 'Jaruwan', 'Kittisak', 'Malai', 'Noppadol', 'Orapan', 'Ratchanon', 'Supaporn', 'Thawatchai', 'Yaowalak'],
  'Philippines': ['Juan', 'Maria', 'Jose', 'Ana', 'Pedro', 'Rosa', 'Carlos', 'Elena', 'Miguel', 'Carmen', 'Antonio', 'Teresa', 'Rafael', 'Luz', 'Francisco', 'Corazon', 'Manuel', 'Guadalupe', 'Ricardo', 'Remedios', 'Eduardo', 'Esperanza', 'Roberto', 'Soledad', 'Fernando', 'Milagros', 'Alejandro', 'Rosario', 'Gabriel', 'Consuelo'],
  'Brunei': ['Haji', 'Pengiran', 'Dayang', 'Awang', 'Maimunah', 'Salleh', 'Ibrahim', 'Hassan', 'Zainal', 'Kamis', 'Noraini', 'Rozan', 'Azman', 'Saiful', 'Fadzil', 'Nabilah', 'Khairul', 'Afiqah', 'Izzat', 'Syafiqah', 'Rizal', 'Nabil', 'Amal', 'Wafi', 'Hakim', 'Qistina', 'Danial', 'Zara', 'Umar', 'Nadhirah'],
  'Australia': ['James', 'Emma', 'Liam', 'Olivia', 'Noah', 'Charlotte', 'William', 'Amelia', 'Jack', 'Sophie', 'Oliver', 'Emily', 'Thomas', 'Chloe', 'Lucas', 'Mia', 'Ethan', 'Isla', 'Mason', 'Grace', 'Alexander', 'Zoe', 'Henry', 'Lily', 'Sebastian', 'Evie', 'Oscar', 'Ruby', 'Leo', 'Matilda'],
  'America': ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Christopher', 'Karen', 'Charles', 'Lisa', 'Daniel', 'Nancy', 'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra'],
  'China': ['Wei', 'Fang', 'Lei', 'Na', 'Jun', 'Ying', 'Tao', 'Juan', 'Gang', 'Li', 'Qiang', 'Yan', 'Yong', 'Hua', 'Bin', 'Xia', 'Hao', 'Mei', 'Jie', 'Lan', 'Chao', 'Yun', 'Ming', 'Fen', 'Jian', 'Ping', 'Sheng', 'Ling', 'Hai', 'Qing'],
  'United Kingdom': ['Oliver', 'Amelia', 'Harry', 'Isla', 'George', 'Emily', 'Noah', 'Ava', 'Jack', 'Lily', 'Jacob', 'Sophie', 'Leo', 'Rosie', 'Oscar', 'Grace', 'Charlie', 'Evie', 'Henry', 'Charlotte', 'Thomas', 'Poppy', 'Arthur', 'Freya', 'Alfie', 'Mia', 'Joshua', 'Willow', 'James', 'Ella'],
  'Japan': ['Yuki', 'Haruki', 'Sakura', 'Ren', 'Aoi', 'Sota', 'Mio', 'Takumi', 'Yui', 'Kento', 'Hina', 'Riku', 'Akari', 'Shota', 'Rin', 'Yuto', 'Mei', 'Kai', 'Misaki', 'Soshi', 'Nana', 'Hayato', 'Yuna', 'Koki', 'Maho', 'Daiki', 'Koharu', 'Takeru', 'Ichika', 'Ryusei'],
  'Germany': ['Lukas', 'Hannah', 'Felix', 'Lea', 'Paul', 'Anna', 'Leon', 'Emilia', 'Finn', 'Sophie', 'Elias', 'Mia', 'Noah', 'Emma', 'Maximilian', 'Lina', 'Jonas', 'Clara', 'Moritz', 'Marie', 'Tim', 'Lena', 'Niklas', 'Sarah', 'Jan', 'Laura', 'Ben', 'Alina', 'David', 'Johanna'],
  'South Korea': ['Min-jun', 'Seo-yeon', 'Ji-hoon', 'Ha-eun', 'Seo-jun', 'Da-eun', 'Do-yoon', 'Si-woo', 'Ye-jun', 'Chae-won', 'Jun-seo', 'Ji-woo', 'Hyun-woo', 'Seo-ah', 'Gun-woo', 'Ji-ah', 'Jun-woo', 'Ha-young', 'Min-seo', 'Soo-jin', 'Woo-jin', 'Yeon-woo', 'Jin-woo', 'Eun-bi', 'Sung-min', 'Na-eun', 'Dong-hyun', 'Su-bin', 'Jae-hyun', 'Yu-na'],
  'France': ['Louis', 'Jules', 'Gabriel', 'Raphaël', 'Arthur', 'Louise', 'Emma', 'Chloé', 'Alice', 'Inès', 'Hugo', 'Léa', 'Adam', 'Manon', 'Lucas', 'Camille', 'Ethan', 'Zoé', 'Nathan', 'Juliette', 'Théo', 'Margaux', 'Tom', 'Clara', 'Enzo', 'Eva', 'Antoine', 'Lola', 'Alexandre', 'Jeanne'],
  'Canada': ['Liam', 'Emma', 'Noah', 'Olivia', 'William', 'Ava', 'James', 'Sophia', 'Oliver', 'Isabella', 'Benjamin', 'Mia', 'Ethan', 'Charlotte', 'Lucas', 'Amelia', 'Mason', 'Harper', 'Logan', 'Ella', 'Alexander', 'Scarlett', 'Owen', 'Grace', 'Daniel', 'Lily', 'Henry', 'Victoria', 'Jackson', 'Chloe'],
  'India': ['Aarav', 'Ananya', 'Vivaan', 'Diya', 'Aditya', 'Sara', 'Vihaan', 'Aanya', 'Arjun', 'Myra', 'Sai', 'Ishita', 'Reyansh', 'Anika', 'Ayaan', 'Pari', 'Krishna', 'Riya', 'Ishaan', 'Nisha', 'Dhruv', 'Kavya', 'Kabir', 'Aisha', 'Rohan', 'Meera', 'Amit', 'Pooja', 'Rahul', 'Neha'],
  'Italy': ['Leonardo', 'Sofia', 'Francesco', 'Giulia', 'Alessandro', 'Aurora', 'Lorenzo', 'Ginevra', 'Mattia', 'Vittoria', 'Gabriele', 'Beatrice', 'Riccardo', 'Ludovica', 'Edoardo', 'Chiara', 'Tommaso', 'Gaia', 'Andrea', 'Anna', 'Marco', 'Giorgia', 'Luca', 'Francesca', 'Giovanni', 'Alice', 'Pietro', 'Elena', 'Filippo', 'Martina'],
  'Poland': ['Jakub', 'Zuzanna', 'Jan', 'Maja', 'Szymon', 'Hanna', 'Filip', 'Lena', 'Mikołaj', 'Alicja', 'Wojciech', 'Maria', 'Adam', 'Oliwia', 'Kacper', 'Amelia', 'Marcin', 'Natalia', 'Bartłomiej', 'Julia', 'Tomasz', 'Weronika', 'Piotr', 'Zofia', 'Maciej', 'Emilia', 'Paweł', 'Karolina', 'Krzysztof', 'Aleksandra'],
  'Brazil': ['Miguel', 'Sophia', 'Arthur', 'Alice', 'Heitor', 'Julia', 'Davi', 'Isabella', 'Lorenzo', 'Manuela', 'Théo', 'Valentina', 'Pedro', 'Lorena', 'Gabriel', 'Lívia', 'Matheus', 'Helena', 'Lucas', 'Laura', 'Benjamin', 'Giovanna', 'Nicolas', 'Maria', 'Guilherme', 'Eloá', 'Rafael', 'Cecília', 'Joaquim', 'Lara'],
  'Mexico': ['Santiago', 'Sofía', 'Sebastián', 'Valentina', 'Mateo', 'Camila', 'Nicolás', 'Valeria', 'Alejandro', 'Ximena', 'Diego', 'Mariana', 'Samuel', 'Regina', 'Benjamin', 'Ana', 'Daniel', 'Paula', 'Joaquín', 'Emma', 'Matías', 'Victoria', 'Lucas', 'Lucía', 'Emiliano', 'Isabella', 'Andrés', 'Sofia', 'Leonardo', 'Renata'],
  'Spain': ['Hugo', 'Lucía', 'Martín', 'Sofía', 'Lucas', 'María', 'Mateo', 'Julia', 'Leo', 'Paula', 'Daniel', 'Valeria', 'Alejandro', 'Emma', 'Pablo', 'Daniela', 'Manuel', 'Alba', 'Álvaro', 'Noa', 'Adrián', 'Carla', 'Mario', 'Sara', 'Diego', 'Marta', 'Enzo', 'Carmen', 'Marco', 'Irene'],
  'Netherlands': ['Noah', 'Emma', 'Lucas', 'Sophie', 'Finn', 'Julia', 'Daan', 'Tess', 'Levi', 'Mila', 'Sem', 'Sara', 'Luuk', 'Anna', 'Bram', 'Evi', 'Jesse', 'Fleur', 'Max', 'Lotte', 'Thomas', 'Nina', 'Sam', 'Eva', 'Luca', 'Zoë', 'Hugo', 'Lieke', 'Thijs', 'Roos'],
  'Sweden': ['Lucas', 'Astrid', 'William', 'Maja', 'Liam', 'Ella', 'Noah', 'Alma', 'Oscar', 'Freja', 'Erik', 'Saga', 'Hugo', 'Alicia', 'Axel', 'Ellie', 'Theo', 'Wilma', 'Elias', 'Ebba', 'Alexander', 'Selma', 'Viktor', 'Ines', 'Filip', 'Signe', 'Anton', 'Stella', 'Gustav', 'Liv'],
  'Denmark': ['Noah', 'Emma', 'Frederik', 'Alma', 'William', 'Clara', 'Lucas', 'Freja', 'Emil', 'Sofie', 'Oliver', 'Anna', 'Malthe', 'Ella', 'Elias', 'Agnes', 'Valdemar', 'Lily', 'Aksel', 'Ida', 'Magnus', 'Laura', 'August', 'Karla', 'Viggo', 'Maja', 'Felix', 'Isabella', 'Alexander', 'Astrid'],
  'Turkey': ['Yusuf', 'Zeynep', 'Eymen', 'Elif', 'Ömer', 'Defne', 'Mustafa', 'Asel', 'Ali', 'Nehir', 'Ahmet', 'Ecrin', 'Emir', 'Lina', 'Mehmet', 'Duru', 'Berat', 'Miray', 'Ömer Faruk', 'Eylül', 'Aras', 'Ada', 'Kerem', 'Derin', 'Alparslan', 'İkra', 'Muhammed', 'Yaren', 'Bugra', 'Sude'],
}

const LAST_NAMES: Record<string, string[]> = {
  'Indonesia': ['Pratama', 'Wijaya', 'Putra', 'Sari', 'Kusuma', 'Lestari', 'Saputra', 'Anggraeni', 'Hidayat', 'Rahayu', 'Setiawan', 'Wulandari', 'Gunawan', 'Fitriani', 'Susanto', 'Pertiwi', 'Halim', 'Cahyadi', 'Nugroho', 'Maharani'],
  'Malaysia': ['bin Ahmad', 'binti Mohamed', 'Abdullah', 'Ibrahim', 'Hassan', 'bin Omar', 'binti Ali', 'Mohamed', 'bin Ismail', 'binti Yusof', 'Rahman', 'bin Ibrahim', 'binti Hassan', 'Salleh', 'bin Salleh', 'binti Ahmad', 'Kamal', 'bin Kamal', 'binti Ibrahim', 'Yusof'],
  'Singapore': ['Tan', 'Lim', 'Wong', 'Ng', 'Ong', 'Chua', 'Koh', 'Teo', 'Sim', 'Ang', 'Yeo', 'Loh', 'Goh', 'Lee', 'Chen', 'Huang', 'Lin', 'Wang', 'Zhang', 'Liu'],
  'Thailand': ['Jaidee', 'Srisai', 'Charoenpol', 'Pholsena', 'Kittisak', 'Wongsawat', 'Suksawat', 'Rattanaporn', 'Chaisiri', 'Somboon', 'Prasert', 'Thongkham', 'Inthavong', 'Sihavong', 'Phommasak', 'Keovilay', 'Vongsa', 'Chanthavong', 'Sysavath', 'Phimmasone'],
  'Philippines': ['Santos', 'Cruz', 'Garcia', 'Reyes', 'Mendoza', 'Torres', 'Ramos', 'Rivera', 'Gonzales', 'Aquino', 'Villanueva', 'Fernandez', 'Lopez', 'Perez', 'Castillo', 'Dela Cruz', 'Bautista', 'Santiago', 'Morales', 'Gutierrez'],
  'Brunei': ['bin Haji', 'binti Haji', 'Awang', 'Pengiran', 'Dayang', 'Hassan', 'Ibrahim', 'Mohamed', 'Salleh', 'Omar', 'Yusof', 'Ahmad', 'Ali', 'Ismail', 'Abdullah', 'Khalid', 'Zainal', 'Kamal', 'Harun', 'Rashid'],
  'Australia': ['Smith', 'Jones', 'Williams', 'Brown', 'Wilson', 'Taylor', 'Johnson', 'White', 'Martin', 'Anderson', 'Thompson', 'Harris', 'Robinson', 'Clark', 'Lewis', 'Lee', 'Walker', 'Hall', 'Young', 'King'],
  'America': ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'],
  'China': ['Wang', 'Li', 'Zhang', 'Liu', 'Chen', 'Yang', 'Huang', 'Zhao', 'Wu', 'Zhou', 'Xu', 'Sun', 'Ma', 'Zhu', 'Hu', 'Guo', 'He', 'Lin', 'Luo', 'Zheng'],
  'United Kingdom': ['Smith', 'Jones', 'Williams', 'Taylor', 'Brown', 'Davies', 'Evans', 'Wilson', 'Thomas', 'Roberts', 'Johnson', 'Lewis', 'Walker', 'Robinson', 'Wood', 'Thompson', 'White', 'Watson', 'Jackson', 'Wright'],
  'Japan': ['Tanaka', 'Suzuki', 'Takahashi', 'Watanabe', 'Ito', 'Yamamoto', 'Nakamura', 'Kobayashi', 'Saito', 'Kato', 'Yoshida', 'Yamada', 'Sasaki', 'Matsumoto', 'Inoue', 'Kimura', 'Shimizu', 'Hayashi', 'Sato', 'Mori'],
  'Germany': ['Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Koch', 'Richter', 'Klein', 'Wolf', 'Schröder', 'Neumann', 'Schwarz', 'Braun', 'Zimmermann', 'Hartmann'],
  'South Korea': ['Kim', 'Lee', 'Park', 'Choi', 'Jung', 'Kang', 'Cho', 'Yoon', 'Jang', 'Lim', 'Shin', 'Oh', 'Seo', 'Kwon', 'Hwang', 'Ahn', 'Song', 'Ryu', 'Hong', 'Yoo'],
  'France': ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier'],
  'Canada': ['Smith', 'Brown', 'Tremblay', 'Martin', 'Roy', 'Wilson', 'MacDonald', 'Gagnon', 'Johnson', 'Taylor', 'Campbell', 'Anderson', 'LeBlanc', 'Lee', 'Jones', 'Williams', 'Thompson', 'Singh', 'Moore', 'Clark'],
  'India': ['Kumar', 'Singh', 'Sharma', 'Patel', 'Gupta', 'Das', 'Mehta', 'Shah', 'Rao', 'Verma', 'Reddy', 'Nair', 'Iyer', 'Joshi', 'Mishra', 'Pandey', 'Chauhan', 'Malhotra', 'Kapoor', 'Sinha'],
  'Italy': ['Rossi', 'Russo', 'Ferrari', 'Esposito', 'Bianchi', 'Romano', 'Colombo', 'Ricci', 'Marino', 'Greco', 'Bruno', 'Gallo', 'Conti', 'De Luca', 'Mancini', 'Costa', 'Giordano', 'Rizzo', 'Lombardi', 'Barbieri'],
  'Poland': ['Nowak', 'Kowalski', 'Wiśniewski', 'Wójcik', 'Kowalczyk', 'Kamiński', 'Lewandowski', 'Zieliński', 'Szymański', 'Woźniak', 'Dąbrowski', 'Kozłowski', 'Jankowski', 'Mazur', 'Kwiatkowski', 'Krawczyk', 'Piotrowski', 'Grabowski', 'Nowakowski', 'Pawłowski'],
  'Brazil': ['Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves', 'Pereira', 'Lima', 'Gomes', 'Costa', 'Ribeiro', 'Martins', 'Carvalho', 'Almeida', 'Lopes', 'Soares', 'Fernandes', 'Vieira', 'Barbosa'],
  'Mexico': ['García', 'Hernández', 'López', 'Martínez', 'González', 'Rodríguez', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores', 'Rivera', 'Gómez', 'Díaz', 'Cruz', 'Morales', 'Reyes', 'Gutiérrez', 'Ortiz', 'Ruiz'],
  'Spain': ['García', 'Rodríguez', 'González', 'Fernández', 'López', 'Martínez', 'Sánchez', 'Pérez', 'Gómez', 'Martín', 'Jiménez', 'Ruiz', 'Hernández', 'Díaz', 'Moreno', 'Muñoz', 'Álvarez', 'Romero', 'Alonso', 'Gutiérrez'],
  'Netherlands': ['de Jong', 'de Vries', 'van den Berg', 'van Dijk', 'Bakker', 'Janssen', 'Visser', 'Smit', 'Bos', 'Meijer', 'de Boer', 'Mulder', 'de Groot', 'Bos', 'Vos', 'Peters', 'Hendriks', 'van Leeuwen', 'Dekker', 'Brouwer'],
  'Sweden': ['Andersson', 'Johansson', 'Karlsson', 'Nilsson', 'Eriksson', 'Larsson', 'Olsson', 'Persson', 'Svensson', 'Gustafsson', 'Pettersson', 'Jonsson', 'Lindberg', 'Jakobsson', 'Magnusson', 'Olofsson', 'Lindström', 'Lindqvist', 'Lindgren', 'Berg'],
  'Denmark': ['Nielsen', 'Jensen', 'Hansen', 'Pedersen', 'Andersen', 'Christensen', 'Larsen', 'Sørensen', 'Rasmussen', 'Jørgensen', 'Petersen', 'Madsen', 'Kristensen', 'Olsen', 'Thomsen', 'Christiansen', 'Poulsen', 'Johansen', 'Møller', 'Mortensen'],
  'Turkey': ['Yılmaz', 'Kaya', 'Demir', 'Çelik', 'Şahin', 'Yıldız', 'Yıldırım', 'Öztürk', 'Aydın', 'Özdemir', 'Arslan', 'Doğan', 'Kılıç', 'Aslan', 'Çetin', 'Karataş', 'Kurt', 'Özkan', 'Şimşek', 'Polat'],
}

const CITIES: Record<string, string[]> = {
  'Indonesia': ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang', 'Makassar', 'Palembang', 'Tangerang', 'Depok', 'Bekasi'],
  'Malaysia': ['Kuala Lumpur', 'George Town', 'Johor Bahru', 'Ipoh', 'Shah Alam', 'Petaling Jaya', 'Kuching', 'Kota Kinabalu', 'Malacca City', 'Alor Setar'],
  'Singapore': ['Singapore', 'Singapore', 'Singapore', 'Singapore', 'Singapore'],
  'Thailand': ['Bangkok', 'Chiang Mai', 'Pattaya', 'Phuket', 'Hat Yai', 'Nakhon Ratchasima', 'Khon Kaen', 'Udon Thani', 'Chiang Rai', 'Nakhon Si Thammarat'],
  'Philippines': ['Manila', 'Quezon City', 'Davao City', 'Caloocan', 'Cebu City', 'Zamboanga City', 'Taguig', 'Antipolo', 'Pasig', 'Cagayan de Oro'],
  'Brunei': ['Bandar Seri Begawan', 'Seria', 'Tutong', 'Temburong', 'Kuala Belait'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast', 'Canberra', 'Newcastle', 'Wollongong', 'Hobart'],
  'America': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'Austin'],
  'China': ['Beijing', 'Shanghai', 'Guangzhou', 'Shenzhen', 'Chengdu', 'Hangzhou', 'Wuhan', 'Nanjing', 'Tianjin', 'Chongqing'],
  'United Kingdom': ['London', 'Manchester', 'Birmingham', 'Leeds', 'Glasgow', 'Liverpool', 'Bristol', 'Sheffield', 'Edinburgh', 'Leicester'],
  'Japan': ['Tokyo', 'Osaka', 'Yokohama', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe', 'Kawasaki', 'Kyoto', 'Saitama'],
  'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart', 'Düsseldorf', 'Leipzig', 'Dortmund', 'Essen'],
  'South Korea': ['Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Suwon', 'Ulsan', 'Sejong', 'Jeju'],
  'France': ['Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes', 'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'],
  'Canada': ['Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener'],
  'India': ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'],
  'Italy': ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa', 'Bologna', 'Florence', 'Catania', 'Bari'],
  'Poland': ['Warsaw', 'Kraków', 'Łódź', 'Wrocław', 'Poznań', 'Gdańsk', 'Szczecin', 'Bydgoszcz', 'Lublin', 'Katowice'],
  'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre'],
  'Mexico': ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 'León', 'Juárez', 'Zapopan', 'Mérida', 'San Luis Potosí'],
  'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza', 'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao'],
  'Netherlands': ['Amsterdam', 'Rotterdam', 'The Hague', 'Utrecht', 'Eindhoven', 'Tilburg', 'Groningen', 'Almere', 'Breda', 'Nijmegen'],
  'Sweden': ['Stockholm', 'Gothenburg', 'Malmö', 'Uppsala', 'Västerås', 'Örebro', 'Linköping', 'Helsingborg', 'Jönköping', 'Norrköping'],
  'Denmark': ['Copenhagen', 'Aarhus', 'Odense', 'Aalborg', 'Esbjerg', 'Randers', 'Kolding', 'Horsens', 'Vejle', 'Roskilde'],
  'Turkey': ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep', 'Şanlıurfa', 'Kocaeli'],
}

const ZIP_CODES: Record<string, string[]> = {
  'Indonesia': ['10110', '60111', '40111', '20111', '50111', '90111', '30111', '15111', '16111', '17111'],
  'Malaysia': ['50000', '10000', '80000', '30000', '40000', '46000', '93000', '88000', '75000', '05000'],
  'Singapore': ['238823', '238824', '238825', '238826', '238827'],
  'Thailand': ['10100', '50000', '20000', '83000', '90000', '30000', '40000', '41000', '57000', '80000'],
  'Philippines': ['1000', '1100', '6000', '1400', '6000', '7000', '1630', '1870', '1600', '3500'],
  'Brunei': ['BE1118', 'BE1318', 'BE2118', 'BE1518', 'BE3118'],
  'Australia': ['2000', '3000', '4000', '6000', '5000', '4217', '2600', '2300', '2500', '7000'],
  'America': ['10001', '90001', '60601', '77001', '85001', '19101', '78201', '92101', '75201', '73301'],
  'China': ['100000', '200000', '510000', '518000', '610000', '310000', '430000', '210000', '300000', '400000'],
  'United Kingdom': ['EC1A 1BB', 'M1 1AE', 'B1 1BB', 'LS1 1BA', 'G1 1AA', 'L1 1JQ', 'BS1 1AA', 'S1 1AA', 'EH1 1YZ', 'LE1 1AA'],
  'Japan': ['100-0001', '530-0001', '231-0001', '450-0001', '060-0001', '810-0001', '650-0001', '210-0001', '600-8001', '330-0001'],
  'Germany': ['10115', '20095', '80331', '50667', '60311', '70173', '40213', '04109', '44135', '45127'],
  'South Korea': ['03171', '48058', '21554', '41911', '35208', '61945', '16422', '44720', '30135', '63122'],
  'France': ['75001', '13001', '69001', '31000', '06000', '44000', '67000', '34000', '33000', '59000'],
  'Canada': ['M5H 2N2', 'H3B 1A4', 'V6C 1A4', 'T2P 1J9', 'T5J 0H3', 'K1A 0A6', 'R3C 0A1', 'G1R 1E5', 'L8P 1A1', 'N2G 1A1'],
  'India': ['400001', '110001', '560001', '500001', '600001', '700001', '411001', '380001', '302001', '226001'],
  'Italy': ['00100', '20100', '80100', '10100', '90100', '16100', '40100', '50100', '95100', '70100'],
  'Poland': ['00-001', '31-001', '90-001', '50-001', '61-001', '80-001', '70-001', '85-001', '20-001', '40-001'],
  'Brazil': ['01000-000', '20000-000', '70000-000', '40000-000', '60000-000', '30000-000', '69000-000', '80000-000', '50000-000', '90000-000'],
  'Mexico': ['06000', '44100', '64000', '72000', '22000', '37000', '32000', '45050', '97000', '78000'],
  'Spain': ['28001', '08001', '46001', '41001', '50001', '29001', '30001', '07001', '35001', '48001'],
  'Netherlands': ['1012', '3011', '2511', '3511', '5611', '5011', '9711', '1311', '4811', '6511'],
  'Sweden': ['11120', '41101', '21101', '75101', '65101', '60201', '58101', '25101', '55101', '60101'],
  'Denmark': ['1000', '8000', '5000', '9000', '6700', '8900', '6000', '8700', '7100', '4000'],
  'Turkey': ['34000', '06000', '35000', '16000', '07000', '01000', '42000', '27000', '63000', '41000'],
}

const PHONE_CODES: Record<string, string> = {
  'Indonesia': '+62', 'Malaysia': '+60', 'Singapore': '+65', 'Thaiplus': '+66', 'Thailand': '+66',
  'Philippines': '+63', 'Brunei': '+673', 'Australia': '+61', 'America': '+1', 'China': '+86',
  'United Kingdom': '+44', 'Japan': '+81', 'Germany': '+49', 'South Korea': '+82', 'France': '+33',
  'Canada': '+1', 'India': '+91', 'Italy': '+39', 'Poland': '+48', 'Brazil': '+55', 'Mexico': '+52',
  'Spain': '+34', 'Netherlands': '+31', 'Sweden': '+46', 'Denmark': '+45', 'Turkey': '+90',
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generatePhone(country: string): string {
  const code = PHONE_CODES[country] || '+1'
  const len = country === 'Singapore' || country === 'Brunei' ? 8 : 10
  let num = ''
  for (let i = 0; i < len; i++) num += Math.floor(Math.random() * 10)
  return code + ' ' + num
}

function generateAddress(country: string, city: string, name: string): any {
  const streets = ['Main St', 'Oak Ave', 'Pine Rd', 'Elm Blvd', 'Maple Dr', 'Cedar Ln', 'Birch Way', 'Walnut Ct', 'Cherry Pl', 'Spruce Cir']
  const num = Math.floor(Math.random() * 999) + 1
  const zip = ZIP_CODES[country] ? randomFrom(ZIP_CODES[country]) : '00000'
  const phone = generatePhone(country)
  
  return {
    id: 'addr_' + Date.now() + Math.random().toString(36).substr(2, 5),
    label: 'Home',
    name: name,
    phone: phone,
    address: `${num} ${randomFrom(streets)}`,
    city: city,
    state: city,
    zip: zip,
    country: country,
    isDefault: true,
  }
}

export function generateDemoAccounts(): DemoAccount[] {
  const accounts: DemoAccount[] = []
  let id = 100000

  // Country distribution
  const distribution: Record<string, number> = {
    'Indonesia': 50,
    'Malaysia': 50,
    'Singapore': 30,
    'Thailand': 20,
    'Philippines': 20,
    'Brunei': 10,
    'Australia': 50,
    'America': 100,
    'China': 100,
    'United Kingdom': 80,
    'Japan': 80,
    'Germany': 60,
    'South Korea': 60,
    'France': 50,
    'Canada': 50,
    'India': 80,
    'Italy': 30,
    'Poland': 20,
    'Brazil': 20,
    'Mexico': 20,
    'Spain': 20,
    'Netherlands': 20,
    'Sweden': 10,
    'Denmark': 10,
    'Turkey': 10,
  }

  // Adjust to reach ~1000 total
  // Total from above: 50+50+30+20+20+10+50+100+100+80+80+60+60+50+50+80+30+20+20+20+20+20+10+10+10 = 1000

  const memberships: Array<'basic' | 'prime' | 'premium'> = ['basic', 'basic', 'basic', 'basic', 'prime', 'prime', 'premium']

  for (const [country, count] of Object.entries(distribution)) {
    const firstNames = FIRST_NAMES[country] || FIRST_NAMES['America']
    const lastNames = LAST_NAMES[country] || LAST_NAMES['America']
    const cities = CITIES[country] || CITIES['America']

    for (let i = 0; i < count; i++) {
      const firstName = randomFrom(firstNames)
      const lastName = randomFrom(lastNames)
      const fullName = `${firstName} ${lastName}`
      const city = randomFrom(cities)
      const emailDomain = country === 'America' ? 'gmail.com' : country === 'United Kingdom' ? 'outlook.com' : country === 'Japan' ? 'yahoo.co.jp' : country === 'Germany' ? 'web.de' : country === 'France' ? 'orange.fr' : country === 'Brazil' ? 'hotmail.com' : country === 'China' ? 'qq.com' : country === 'South Korea' ? 'naver.com' : country === 'India' ? 'gmail.com' : country === 'Indonesia' ? 'gmail.com' : country === 'Malaysia' ? 'gmail.com' : country === 'Singapore' ? 'gmail.com' : 'gmail.com'
      const email = `${firstName.toLowerCase().replace(/[^a-z]/g, '')}.${lastName.toLowerCase().replace(/[^a-z]/g, '')}${Math.floor(Math.random() * 999)}@${emailDomain}`
      
      const joinDate = new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString()
      const membership = randomFrom(memberships)
      const coins = Math.floor(Math.random() * 500)

      accounts.push({
        id: String(id++),
        name: fullName,
        email: email,
        phone: generatePhone(country),
        role: 'user',
        joinDate: joinDate,
        password: 'demo123456',
        addresses: [generateAddress(country, city, fullName)],
        coins: coins,
        membership: membership,
        browsingHistory: [],
        isDemo: true,
        demoCountry: country,
      })
    }
  }

  return accounts
}

// Initialize demo accounts in localStorage
export function initDemoAccounts(): void {
  const key = 'am_demo_accounts'
  if (localStorage.getItem(key)) return // Already initialized
  
  const accounts = generateDemoAccounts()
  localStorage.setItem(key, JSON.stringify(accounts))
  
  // Also merge with existing users
  const existingUsers = JSON.parse(localStorage.getItem('am_users') || '[]')
  const existingEmails = new Set(existingUsers.map((u: any) => u.email))
  const newUsers = accounts.filter(a => !existingEmails.has(a.email))
  const merged = [...existingUsers, ...newUsers]
  localStorage.setItem('am_users', JSON.stringify(merged))
}

export function getDemoAccounts(): DemoAccount[] {
  return JSON.parse(localStorage.getItem('am_demo_accounts') || '[]')
}

export function isDemoAccount(email: string): boolean {
  const demos = getDemoAccounts()
  return demos.some(d => d.email === email)
}
