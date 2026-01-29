-- Seed Data for Aib HUB

-- 1. Insert Creators
-- Note: We are not linking them to real Auth Users yet, so linked_user_id is NULL. 
-- They will be 'claimed' or just exist as static profiles for now.

INSERT INTO public.creators (id, full_name, email, city, bio, experience, profile_photo, whatsapp, is_featured, tier, status, skills, purchased_tags, portfolio)
VALUES
  (
    gen_random_uuid(), 
    'Arjun Mehta', 'arjun@example.com', 'Mumbai', 
    'Passionate designer with 5+ years of experience in creating digital products that matter.', 
    'Previously worked at Tech Giants and Boutique Agencies.', 
    'https://picsum.photos/seed/arjun/400/400', '919876543210', true, 'PLATINUM', 'APPROVED',
    ARRAY['UI/UX Design', 'Brand Identity', 'Illustration'],
    ARRAY['UI/UX Design'],
    '[{"id": "p1", "type": "image", "url": "https://picsum.photos/seed/p1/800/600", "title": "Brand Revamp"}, {"id": "p2", "type": "image", "url": "https://picsum.photos/seed/p2/800/600", "title": "Mobile App"}]'::jsonb
  ),
  (
    gen_random_uuid(),
    'Sara Khan', 'sara@example.com', 'Bangalore',
    'Wordsmith helping brands tell their stories through engaging and high-ranking content.',
    'Ex-Journalist and Freelance Content Strategist.',
    'https://picsum.photos/seed/sara/400/400', '919888877777', false, 'BASE', 'APPROVED',
    ARRAY['Content Writing', 'SEO', 'Copywriting'],
    ARRAY[]::text[],
    '[]'::jsonb
  ),
  (
    gen_random_uuid(),
    'Vikram Singh', 'vikram@example.com', 'Delhi',
    'Cinematographer and editor specializing in high-energy commercial videos and documentaries.',
    '8 years in the film industry.',
    'https://picsum.photos/seed/vikram/400/400', '919000011111', true, 'GOLD', 'APPROVED',
    ARRAY['Video Editing', 'Motion Graphics', 'Cinematography'],
    ARRAY['Video Editing'],
    '[{"id": "v1", "type": "video", "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ", "title": "Showreel 2023"}]'::jsonb
  ),
  (
    gen_random_uuid(),
    'Hubaib Khan', 'hubaib@example.com', 'Indore',
    'Visual storyteller based in Indore. Specializing in high-impact video production and minimalist logo design.',
    'Freelancing for international clients for 4 years.',
    'https://picsum.photos/seed/hubaib/400/400', '917000123456', true, 'PLATINUM', 'APPROVED',
    ARRAY['Video Editing', 'Logo Creator', 'Cinematography'],
    ARRAY['Video Editor', 'Logo Creator'],
    '[]'::jsonb
  ),
  (
    gen_random_uuid(),
    'Meera Iyer', 'meera@example.com', 'Chennai',
    'Minimalist designer focusing on eco-friendly packaging and brand aesthetics.',
    'Worked with top FMCG brands in India.',
    'https://picsum.photos/seed/meera/400/400', '919900887766', false, 'GOLD', 'APPROVED',
    ARRAY['Graphic Design', 'Package Design'],
    ARRAY[]::text[],
    '[]'::jsonb
  ),
  (
    gen_random_uuid(),
    'Rohan Joshi', 'rohan@example.com', 'Pune',
    'Full stack developer building performant web applications.',
    '3 years at a tech startup.',
    'https://picsum.photos/seed/rohan/400/400', '918800112233', false, 'BASE', 'APPROVED',
    ARRAY['Web Development', 'React', 'Node.js'],
    ARRAY[]::text[],
    '[]'::jsonb
  ),
  (
    gen_random_uuid(),
    'Ananya Roy', 'ananya@example.com', 'Kolkata',
    'Fine art photographer and digital illustrator exploring the intersection of reality and dreams.',
    'Exhibited in 3 national galleries.',
    'https://picsum.photos/seed/ananya/400/400', '917766554433', true, 'PLATINUM', 'APPROVED',
    ARRAY['Photography', 'Digital Art'],
    ARRAY['Digital Art'],
    '[]'::jsonb
  ),
  (
    gen_random_uuid(),
    'Ishan Gupta', 'ishan@example.com', 'Mumbai',
    'Crafting unique sonic identities for brands and films.',
    'Produced soundtracks for several award-winning short films.',
    'https://picsum.photos/seed/ishan/400/400', '919555443322', false, 'BASE', 'APPROVED',
    ARRAY['Music Production', 'Sound Design'],
    ARRAY[]::text[],
    '[]'::jsonb
  ),
  (
    gen_random_uuid(),
    'Zoya Ahmed', 'zoya@example.com', 'Hyderabad',
    '3D artist with a passion for character creation and environmental design.',
    'Lead artist at a gaming studio.',
    'https://picsum.photos/seed/zoya/400/400', '919222334455', false, 'GOLD', 'APPROVED',
    ARRAY['3D Modeling', 'Character Design'],
    ARRAY['3D Modeling'],
    '[]'::jsonb
  ),
  (
    gen_random_uuid(),
    'Kabir Das', 'kabir@example.com', 'Ahmedabad',
    'Building smooth mobile experiences across platforms.',
    'Developed and published 5+ apps on Play Store.',
    'https://picsum.photos/seed/kabir/400/400', '919111223344', false, 'BASE', 'APPROVED',
    ARRAY['App Development', 'Flutter'],
    ARRAY[]::text[],
    '[]'::jsonb
  ),
  (
    gen_random_uuid(),
    'Aisha Verma', 'aisha@example.com', 'Indore',
    'Frontend enthusiast creating pixel-perfect interfaces in the heart of MP.',
    'Ex-Amazon intern, now full-time freelancer.',
    'https://picsum.photos/seed/aisha/400/400', '919000554433', true, 'PLATINUM', 'APPROVED',
    ARRAY['Web Developer', 'UI Design'],
    ARRAY['Web Developer'],
    '[]'::jsonb
  );

-- 2. Insert Jobs
INSERT INTO public.jobs (title, city, required_skills, description, budget, company, contact_email, whatsapp, posted_date, status)
VALUES
  ('Senior Graphic Designer', 'Remote', ARRAY['Adobe Creative Suite', 'Figma'], 'We are looking for a creative thinker to join our fast-paced marketing team.', '₹45,000 / PROJECT', 'Creative Edge', 'careers@creativeedge.com', '919876543210', '2023-10-25', 'OPEN'),
  ('Video Editor (Short Form)', 'Indore', ARRAY['Premiere Pro', 'After Effects'], 'Looking for a talented editor for daily Reels/TikTok production.', '₹2,500 / REEL', 'Vlog Studio', 'hr@vlogstudio.in', '917000998877', '2023-11-01', 'OPEN'),
  ('Full Stack Developer', 'Bangalore', ARRAY['React', 'Node.js', 'PostgreSQL'], 'Join our early-stage fintech startup to build the next generation of banking.', '₹1.2L / MONTH', 'PayFlow Tech', 'tech@payflow.com', '918899001122', '2023-11-02', 'OPEN'),
  ('Motion Graphics Artist', 'Mumbai', ARRAY['After Effects', 'Cinema 4D'], 'Lead motion designer for an upcoming music video project.', '₹75,000 / PROJECT', 'Mumbai Media Works', 'prod@mumbaimedia.in', '919122334455', '2023-11-03', 'OPEN'),
  ('Social Media Manager', 'Remote', ARRAY['Strategy', 'Copywriting', 'Analytics'], 'Managing a portfolio of 5 lifestyle brands.', '₹40,000 / MONTH', 'SocialScale Agency', 'apply@socialscale.com', '919555664433', '2023-11-04', 'OPEN'),
  ('Logo & Identity Designer', 'Delhi', ARRAY['Illustrator', 'Branding'], 'Contract project for a new boutique hotel chain branding.', '₹35,000 / PROJECT', 'Heritage Hotels', 'design@hotelgroup.com', '919111445566', '2023-11-05', 'OPEN'),
  ('React Native Expert', 'Remote', ARRAY['React Native', 'TypeScript'], 'Fixing bugs and implementing new features for a health-tech app.', '₹80,000 / MODULE', 'HealthPlus', 'ops@healthplus.io', '919000112233', '2023-11-06', 'OPEN'),
  ('Content Strategist', 'Mumbai', ARRAY['SEO', 'Content Planning'], 'Planning content calendar for a luxury real estate portal.', '₹55,000 / MONTH', 'Premium Estates', 'jobs@estatesmumbai.com', '919888776655', '2023-11-07', 'OPEN'),
  ('UI Designer', 'Bangalore', ARRAY['Figma', 'Prototyping'], 'Designing a dashboard for an enterprise SaaS product.', '₹95,000 / PROJECT', 'CloudSync', 'hr@cloudsync.com', '919777553311', '2023-11-08', 'OPEN'),
  ('Product Photographer', 'Hyderabad', ARRAY['Photography', 'Lightroom'], 'Monthly catalog shoots for an e-commerce fashion brand.', '₹12,000 / DAY', 'The Fashion Shop', 'studio@fashionshop.in', '919222554433', '2023-11-09', 'OPEN'),
  ('Technical Writer', 'Pune', ARRAY['Documentation', 'API'], 'Writing developer documentation for a blockchain protocol.', '₹60,000 / MONTH', 'ChainTech Solutions', 'docs@chaintech.com', '919444332211', '2023-11-10', 'OPEN'),
  ('3D Modeler (Game Assets)', 'Delhi', ARRAY['Blender', 'Unity'], 'Creating low-poly assets for a mobile RPG game.', '₹50,000 / PACK', 'HyperCasual Games', 'art@gamestudio.com', '919000445566', '2023-11-11', 'OPEN');
