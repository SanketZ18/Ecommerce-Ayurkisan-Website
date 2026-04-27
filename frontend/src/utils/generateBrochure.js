import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import customerService from './customerService';

export const downloadBrochure = async () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Fetch data from backend
    let products = [];
    let packages = [];
    try {
        const prodRes = await customerService.getAllProducts();
        products = prodRes.data || [];
        const packRes = await customerService.getAllPackages();
        packages = packRes.data || [];
    } catch (error) {
        console.error("Error fetching data for brochure:", error);
    }

    // Function to add a nice header
    const addHeader = (title) => {
        doc.setFillColor(16, 185, 129); // var(--primary-green)
        doc.rect(0, 0, pageWidth, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("Ayurkisan Naturals", 20, 25);
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(title, pageWidth - 20, 25, { align: "right" });
    };

    // Function to add footer
    const addFooter = (pageNumber) => {
        doc.setFillColor(30, 41, 59); // dark bg
        doc.rect(0, pageHeight - 20, pageWidth, 20, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text("www.ayurkisan.com  |  support@ayurkisan.com  |  +91 98765 43210", pageWidth / 2, pageHeight - 8, { align: "center" });
        doc.text(`Page ${pageNumber}`, pageWidth - 20, pageHeight - 8, { align: "right" });
    };

    let pageNum = 1;

    // --- PAGE 1: Cover & Intro ---
    addHeader("Company Brochure");
    
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("Purity of Nature, Delivered to You.", 20, 60);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99);
    const introText = "Ayurkisan Naturals is a farm-to-customer herbal ecosystem. We bridge the gap between farmers and buyers with transparent pricing and exceptional quality products. Our mission is to empower farmers and delight buyers by building a dependable, transparent end-to-end natural produce ecosystem.";
    const splitIntro = doc.splitTextToSize(introText, pageWidth - 40);
    doc.text(splitIntro, 20, 75);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Our Core Product Categories", 20, 110);

    autoTable(doc, {
        startY: 120,
        head: [['Category', 'Description']],
        body: [
            ['Herbal Powders', 'Finely milled pure organic powders for dietary and cosmetic use.'],
            ['Herbal Juices', 'Cold-pressed natural juices for immunity and wellness.'],
            ['Seeds & Nuts', 'Nutrient-rich raw seeds directly sourced from partner farms.'],
            ['Essential Oils', 'Therapeutic grade cold-pressed and steam-distilled oils.'],
            ['Wellness Packages', 'Curated kits combining complementary herbs for specific health goals.']
        ],
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129], textColor: 255 },
        styles: { fontSize: 11, cellPadding: 8 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 50 } }
    });

    addFooter(pageNum++);

    // --- PAGE 2: Product Catalog ---
    if (products.length > 0 || packages.length > 0) {
        doc.addPage();
        addHeader("Product Catalog");

        let currentY = 60;

        if (products.length > 0) {
            doc.setTextColor(30, 41, 59);
            doc.setFontSize(16);
            doc.setFont("helvetica", "bold");
            doc.text("Our Premium Products", 20, currentY);

            const productData = products.map(p => [
                p.productName,
                p.weight || 'N/A',
                p.brand || 'Ayurkisan',
                'Rs. ' + p.price
            ]);

            autoTable(doc, {
                startY: currentY + 10,
                head: [['Product Name', 'Weight', 'Brand', 'Price']],
                body: productData,
                theme: 'striped',
                headStyles: { fillColor: [30, 41, 59], textColor: 255 },
                styles: { fontSize: 10, cellPadding: 6 },
                columnStyles: { 0: { fontStyle: 'bold' } }
            });

            currentY = doc.lastAutoTable.finalY + 20;
        }

        if (packages.length > 0) {
            if (currentY > pageHeight - 60) {
                addFooter(pageNum++);
                doc.addPage();
                addHeader("Wellness Packages");
                currentY = 60;
            } else {
                doc.setTextColor(30, 41, 59);
                doc.setFontSize(16);
                doc.setFont("helvetica", "bold");
                doc.text("Exclusive Wellness Packages", 20, currentY);
            }

            const packageData = packages.map(p => [
                p.name || 'Ayurkisan Package',
                (p.items || []).length + ' Items',
                'Rs. ' + (p.packagePrice || p.finalPrice || p.totalPrice || 0)
            ]);

            autoTable(doc, {
                startY: currentY + 10,
                head: [['Package Name', 'Contents', 'Price']],
                body: packageData,
                theme: 'striped',
                headStyles: { fillColor: [16, 185, 129], textColor: 255 },
                styles: { fontSize: 10, cellPadding: 6 },
                columnStyles: { 0: { fontStyle: 'bold' } }
            });
        }

        addFooter(pageNum++);
    }

    // --- PAGE 3: Process & Contact ---
    doc.addPage();
    addHeader("Process & Contact Information");

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("The Ayurkisan Process", 20, 60);

    autoTable(doc, {
        startY: 70,
        head: [['Step', 'Details']],
        body: [
            ['1. Farm Sourcing', 'We directly partner with certified organic farmers across India, ensuring fair trade and high-quality raw materials.'],
            ['2. Quality Testing', 'Every batch undergoes strict laboratory testing for purity, potency, and absence of heavy metals/pesticides.'],
            ['3. Eco-Packaging', 'Products are packed in sustainable, freshness-preserving materials to maintain herbal efficacy.'],
            ['4. Direct Delivery', 'Shipped straight from our hygienic facilities to your doorstep or retail store with full tracking.']
        ],
        theme: 'grid',
        headStyles: { fillColor: [30, 41, 59], textColor: 255 },
        styles: { fontSize: 11, cellPadding: 8 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 40 } }
    });

    const contactY = doc.lastAutoTable.finalY + 25;
    
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Contact Details", 20, contactY);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99);
    
    const details = [
        "Head Office: Office No 2, Shreejay Apartment, Sadar bazar, Satara, Maharashtra 415001",
        "Phone: +91 98765 43210",
        "Email: ayurkisan.ecommerce@gmail.com",
        "WhatsApp: +91 12345 67890",
        "Business Hours: Mon-Sat, 10:00 AM - 6:00 PM (IST)"
    ];

    details.forEach((line, index) => {
        doc.text(line, 20, contactY + 15 + (index * 8));
    });

    addFooter(pageNum);

    // Trigger Download
    doc.save("Ayurkisan_Brochure.pdf");
};
