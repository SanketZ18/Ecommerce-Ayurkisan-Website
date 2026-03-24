package com.ayurkisan.Modules.Chatbot;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.Arrays;
import java.util.List;

@Component
public class ChatbotDataInitializer implements CommandLineRunner {

    private final FAQRepository faqRepository;

    public ChatbotDataInitializer(FAQRepository faqRepository) {
        this.faqRepository = faqRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (faqRepository.count() == 0) {
            List<FAQ> initialFaqs = Arrays.asList(
                new FAQ("What is Ayurkisan?", "Ayurkisan Naturals is a farm-to-customer herbal ecosystem bridging the gap between farmers and buyers.", Arrays.asList("ayurkisan", "what", "about")),
                new FAQ("Who is the founder?", "Ayurkisan Naturals was founded by Mr. Surendra Kakade, an agriculture expert.", Arrays.asList("founder", "owner", "surendra")),
                new FAQ("Where is your office?", "Our Head Office is in Pune at Heritage Road, Wellness District.", Arrays.asList("office", "location", "pune", "address")),
                new FAQ("How to contact support?", "Reach us at support@ayurkisan.com or call +91 98765 43210.", Arrays.asList("contact", "support", "phone", "email", "whatsapp")),
                new FAQ("What is your mission?", "Our mission is to empower farmers and provide pure herbal products globally.", Arrays.asList("mission", "vision", "goal")),
                new FAQ("Are your products natural?", "Yes, all our products are 100% natural and sourced directly from farms.", Arrays.asList("natural", "herbal", "organic", "pure")),
                new FAQ("How do I place an order?", "Select products, add to cart, and proceed to checkout with your details.", Arrays.asList("order", "buy", "purchase", "place order")),
                new FAQ("What products do you offer?", "We offer a wide range of herbal oils, face washes, and wellness products.", Arrays.asList("products", "items", "catalog", "variety")),
                new FAQ("Joint Pain Relief?", "For joint pain and arthritis relief, we recommend our Pain Relief Oil and Joint Wellness Pack.", Arrays.asList("joint pain", "arthritis", "bone", "pain")),
                new FAQ("Diabetes Support?", "Our Sugar Control Herbal Mix helps manage glucose levels naturally.", Arrays.asList("diabetes", "sugar", "insulin", "glucose")),
                new FAQ("Digestion Issues?", "Try our Triphala churn and Digestive Wellness Kit for relief from gas and acidity.", Arrays.asList("digestion", "gas", "acility", "stomach")),
                new FAQ("Hair Fall solution?", "Rosemary and Bhringraj oils are highly recommended for reducing hair fall and promoting growth.", Arrays.asList("hair fall", "hair loss", "growth")),
                new FAQ("Acne & Pimples?", "Use our Neem and Tea Tree face wash for naturally clear and acne-free skin.", Arrays.asList("acne", "pimple", "skin care")),
                new FAQ("Immunity Booster?", "Our Immunity Kit contains Giloy, Ashwagandha, and Tulsi to strengthen your natural defense.", Arrays.asList("immunity", "booster", "cold", "flu")),
                new FAQ("Stress & Anxiety?", "Ashwagandha capsules are excellent for natural stress relief and better sleep.", Arrays.asList("stress", "anxiety", "sleep", "mental health")),
                new FAQ("Weight Management?", "Try our Herbal Detox Tea and Slimming Pack to support your weight management journey.", Arrays.asList("weight loss", "fat", "detox", "slim")),
                new FAQ("Blood Pressure?", "Arjuna Bark extracts are traditionally used for natural blood pressure support.", Arrays.asList("blood pressure", "bp", "heart")),
                new FAQ("Liver Health?", "Punarnava and Kutki are best for liver detoxification and health.", Arrays.asList("liver", "detox", "jaundice")),
                new FAQ("Kidney Stones?", "Our Stone Crusher Herbal Mix helps in natural kidney stone removal.", Arrays.asList("kidney stone", "stone", "urine")),
                new FAQ("Skin Brightening?", "Saffron gel and Ubtan provide a natural glow and brighter skin tone.", Arrays.asList("glow", "bright", "skin", "whitening")),
                new FAQ("Cough & Cold?", "Tulsi and Ginger drops are very effective for quick respiratory relief.", Arrays.asList("cough", "cold", "fever", "throat")),
                new FAQ("Men's Wellness?", "We have Safed Musli and Shilajit for increased vitality and stamina.", Arrays.asList("men", "vitality", "stamina")),
                new FAQ("Women's Health?", "Shatavari is great for female hormonal balance and overall health.", Arrays.asList("women", "periods", "hormones")),
                new FAQ("Dandruff control?", "Neem and Ginger based hair cleansers work best for flaky and itchy scalp.", Arrays.asList("dandruff", "itchy scalp")),
                new FAQ("Dark Circles?", "Our Eternal Glow serum helps reduce under-eye dark circles and puffiness.", Arrays.asList("dark circles", "eyes", "skin")),
                new FAQ("Constipation relief?", "Isabgol and Triphala provide natural and gentle relief from constipation.", Arrays.asList("constipation", "motions")),
                new FAQ("Memory Booster?", "Brahmi and Shankhpushpi are great for brain health and memory concentration.", Arrays.asList("memory", "brain", "focus")),
                new FAQ("Asthma relief?", "Vasaka and Kantakari help in clear breathing and lung support.", Arrays.asList("asthma", "breath", "lungs")),
                new FAQ("Thyroid support?", "Kanchanar Guggulu is traditionally used for managing thyroid balance.", Arrays.asList("thyroid", "goiter")),
                new FAQ("Piles/Hemorrhoids?", "Arshakuthar Ras and fiber-rich herbal diets help in piles management.", Arrays.asList("piles", "hemorrhoids")),
                new FAQ("Migraine relief?", "Peppermint and Eucalyptus oils provide soothing relief from headaches.", Arrays.asList("migraine", "headache", "pain")),
                new FAQ("Allergy treatment?", "Turmeric and Neem increase your body's anti-allergic response naturally.", Arrays.asList("allergy", "skin rash")),
                new FAQ("Anemia/Iron Support?", "Amla and Beetroot extracts help increase Hemoglobin and iron levels.", Arrays.asList("anemia", "iron", "blood")),
                new FAQ("Anti-Aging solutions?", "Saffron and Almond based creams reduce wrinkles and fine lines.", Arrays.asList("aging", "wrinkles", "young")),
                new FAQ("Eye Care?", "Triphala water and Rose water are traditionally used for keeping eyes cool and healthy.", Arrays.asList("eyes", "vision", "tired eyes")),
                new FAQ("PCOS/PCOD support?", "Ashoka and Aloe Vera extracts help manage PCOS symptoms and cycles.", Arrays.asList("pcos", "pcod", "periods")),
                new FAQ("Cholesterol management?", "Garlic and Guggul help in maintaining healthy lipid profiles.", Arrays.asList("cholesterol", "heart", "fat")),
                new FAQ("Sleep Issues?", "Jatamansi and Tagar are natural herbs that promote restful sleep.", Arrays.asList("sleep", "insomnia")),
                new FAQ("Mouth Ulcers?", "Mulethi (Licorice) is very effective for soothing mouth ulcers.", Arrays.asList("mouth ulcer", "sore")),
                new FAQ("Stronger Bones?", "Hadjod and Calcium-rich herbal supplements support bone strength.", Arrays.asList("bones", "fracture", "calcium")),
                new FAQ("Fever relief?", "Mahasudarshan churn is a potent traditional anti-pyretic for fevers.", Arrays.asList("fever", "viral")),
                new FAQ("Lip Care?", "Our natural lip balms with herbal extracts keep lips soft and hydrated.", Arrays.asList("lips", "lip balm", "dry lips")),
                new FAQ("Eczema/Psoriasis?", "Neem oil and Turmeric help in managing chronic skin conditions.", Arrays.asList("eczema", "psoriasis", "skin")),
                new FAQ("Wound Healing?", "Turmeric and Neem have powerful natural antiseptic properties.", Arrays.asList("wound", "cut", "antiseptic")),
                new FAQ("Teeth/Gums health?", "Neem and Clove based tooth powders ensure total oral hygiene.", Arrays.asList("teeth", "gums", "oral")),
                new FAQ("Urine Infection?", "Gokshura helps in maintaining urinary tract health and clear flow.", Arrays.asList("uti", "urine infection")),
                new FAQ("Back Pain relief?", "Shalyaki and Mahanarayan oil are great for muscle and joint relief.", Arrays.asList("back pain", "muscle")),
                new FAQ("Low Energy?", "Shilajit and Gokshura provide a natural energy boost for daily activities.", Arrays.asList("energy", "fatigue", "tired")),
                new FAQ("Detoxification?", "Neem and Holy Basil (Tulsi) are perfect for blood purification and detox.", Arrays.asList("detox", "blood", "purify")),
                new FAQ("Healthy Heart?", "Arjuna and Garlic are traditionally used for cardiovascular wellness.", Arrays.asList("heart", "cardio"))
            );
            faqRepository.saveAll(initialFaqs);
            System.out.println("✅ Custom FAQ Data Initialized: 50 records created");
        }
    }
}
