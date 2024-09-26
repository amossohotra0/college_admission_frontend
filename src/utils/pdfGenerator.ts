import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Application } from '@/types';

// Helper function to load and add images to PDF with proper error handling
// Convert File to string URL
const getImageUrl = (file: File | string | undefined): string => {
  if (!file) return '';
  if (typeof file === 'string') return file;
  if (file instanceof File) return URL.createObjectURL(file);
  return '';
};

const loadAndAddImage = async (
    doc: jsPDF,
    url: string | File | undefined,
    x: number,
    y: number,
    width: number,
    height: number,
    title: string
): Promise<boolean> => {
  if (!url) return false;
  // Convert File to string URL if needed
  const imageUrl = getImageUrl(url);
  if (!imageUrl) return false;
  try {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Image load timeout')), 5000);
      img.onload = () => {
        clearTimeout(timeout);
        resolve(true);
      };
      img.onerror = () => {
        clearTimeout(timeout);
        reject(new Error('Image load failed'));
      };
    });

    if (img.complete && img.naturalHeight !== 0) {
      doc.addImage(img, 'JPEG', x, y, width, height);
      
      // Clean up object URL if we created one
      if (typeof url !== 'string') {
        URL.revokeObjectURL(imageUrl);
      }
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(title, x + width / 2, y + height + 8, { align: 'center' });
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error loading image (${title}):`, error);
    doc.setFontSize(10);
    doc.setTextColor(255, 0, 0);
    doc.text(`Failed to load ${title}`, x + width / 2, y + height / 2, { align: 'center' });
    return false;
  }
};

export const generateApplicationPDF = async (application: Application): Promise<void> => {
  // Create PDF document in portrait mode with A4 size
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;

  // Add header on first page
  doc.setFillColor(0, 51, 102); // Professional dark blue
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('College Admission Management', pageWidth / 2, 12, { align: 'center' });

  // Application Title
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.setFont('helvetica', 'normal');
  doc.text('Official Application Form', pageWidth / 2, 30, { align: 'center' });

  // Verification Hash (positioned to avoid overlap)
  doc.setFontSize(8);
  doc.setTextColor(100, 100, 100);
  doc.text(`Verification Hash: ${application.verification_hash || 'N/A'}`, margin, 38);

  // Application and Student Details (combined to ensure single page)
  doc.setFontSize(14);
  doc.setTextColor(0, 51, 102);
  doc.text('Application and Student Details', margin, 50);

  const student = application.student;
  const user = student.user;

  // Add student profile picture (positioned to avoid overlap)
  let studentImageAdded = false;
  if (student.picture) {
    const success = await loadAndAddImage(
        doc,
        student.picture,
        pageWidth - 55,
        45,
        40,
        40,
        'Profile Picture'
    );
    studentImageAdded = success;
  }

  // Combined Application and Student Details Table
  autoTable(doc, {
    startY: 60,
    head: [['Field', 'Value']],
    body: [
      ['Application ID', application.tracking_id],
      ['Form Number', application.application_form_no],
      ['Applied On', new Date(application.applied_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })],
      ['Status', application.status.name],
      ['Payment Status', application.payment_status.toUpperCase()],
      ['Program', `${application.program.name} (${application.program.code})`],
      ['Session', application.session.session],
      ['Academic Year', `${application.session.start_date.split('-')[0]}-${application.session.end_date.split('-')[0]}`],
      ['Name', `${user.first_name} ${user.last_name}`],
      ['Email', user.email],
      ['Phone', user.phone || 'N/A'],
      ['CNIC', user.cnic || 'N/A'],
      ['Role', user.role.role.charAt(0).toUpperCase() + user.role.role.slice(1)],
      ['Verification Status', user.is_verified ? 'Verified' : 'Not Verified']
    ],
    theme: 'grid',
    headStyles: {
      fillColor: [0, 51, 102],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold'
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 60 },
      1: { cellWidth: pageWidth - 60 - (studentImageAdded ? 60 : margin * 2) }
    },
    styles: {
      fontSize: 9,
      cellPadding: 2,
      lineWidth: 0.2
    },
    margin: { left: margin, right: studentImageAdded ? 60 : margin }
  });

  // Personal Information Page
  if (student.personal_info) {
    doc.addPage();
    doc.setFillColor(0, 51, 102);
    doc.rect(0, 0, pageWidth, 20, 'F');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('Personal Information & CNIC Documents', pageWidth / 2, 12, { align: 'center' });

    const personalInfo = student.personal_info;
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('Personal Information', margin, 30);

    autoTable(doc, {
      startY: 35,
      head: [['Field', 'Value']],
      body: [
        ["Father's Name", personalInfo.father_name],
        ['CNIC', personalInfo.cnic],
        ['Contact', personalInfo.registered_contact],
        ['Date of Birth', new Date(personalInfo.date_of_birth).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })],
        ['Gender', personalInfo.gender.charAt(0).toUpperCase() + personalInfo.gender.slice(1)]
      ],
      theme: 'grid',
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255], fontSize: 10 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 'auto' }
      },
      styles: { fontSize: 9, cellPadding: 2 },
      margin: { left: margin, right: margin }
    });

    // CNIC Documents
    const cnicY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('National Identity Card (CNIC)', margin, cnicY);

    if (personalInfo.cnic_front_img || personalInfo.cnic_back_img) {
      if (personalInfo.cnic_front_img) {
        await loadAndAddImage(
            doc,
            personalInfo.cnic_front_img,
            margin,
            cnicY + 10,
            80,
            50,
            'CNIC Front'
        );
      }
      if (personalInfo.cnic_back_img) {
        await loadAndAddImage(
            doc,
            personalInfo.cnic_back_img,
            pageWidth - 95,
            cnicY + 10,
            80,
            50,
            'CNIC Back'
        );
      }
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);
      doc.text(
          'This document is an official copy of the applicant\'s National Identity Card.',
          pageWidth / 2,
          cnicY + 70,
          { align: 'center' }
      );
      doc.text(`CNIC Number: ${personalInfo.cnic || 'N/A'}`, pageWidth / 2, cnicY + 80, { align: 'center' });
    } else {
      doc.setFontSize(10);
      doc.setTextColor(255, 0, 0);
      doc.text('No CNIC images available', pageWidth / 2, cnicY + 20, { align: 'center' });
    }
  }

  // Contact Information Page
  if (student.contact_info) {
    doc.addPage();
    doc.setFillColor(0, 51, 102);
    doc.rect(0, 0, pageWidth, 20, 'F');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('Contact Information', pageWidth / 2, 12, { align: 'center' });

    const contactInfo = student.contact_info;
    doc.setFontSize(14);
    doc.setTextColor(0, 51, 102);
    doc.text('Contact Details', margin, 30);

    autoTable(doc, {
      startY: 35,
      head: [['Field', 'Value']],
      body: [
        ['District', contactInfo.district],
        ['Tehsil', contactInfo.tehsil],
        ['City', contactInfo.city],
        ['Permanent Address', contactInfo.permanent_address],
        ['Current Address', contactInfo.current_address],
        ['Postal Address', contactInfo.postal_address]
      ],
      theme: 'grid',
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255], fontSize: 10 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 'auto' }
      },
      styles: { fontSize: 9, cellPadding: 2 },
      margin: { left: margin, right: margin }
    });
  }

  // Educational Records Page
  doc.addPage();
  doc.setFillColor(0, 51, 102);
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('Educational Records', pageWidth / 2, 12, { align: 'center' });

  if (student.educational_records && student.educational_records.length > 0) {
    const tableColumn = ['Degree', 'Institution', 'Year', 'Marks', 'Percentage', 'Grade'];
    const tableRows = student.educational_records.map((record: any) => [
      record.degree_name,
      record.institution_name,
      record.passing_year,
      `${record.obtained_marks}/${record.total_marks}`,
      `${record.percentage}%`,
      record.grade || 'N/A'
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255], fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 50 },
        2: { cellWidth: 20 },
        3: { cellWidth: 25 },
        4: { cellWidth: 25 },
        5: { cellWidth: 20 }
      },
      styles: { fontSize: 9, cellPadding: 2 },
      margin: { left: margin, right: margin }
    });

    // Educational Certificates (one per page)
    for (const record of student.educational_records) {
      if (record.certificate) {
        doc.addPage();
        doc.setFillColor(0, 51, 102);
        doc.rect(0, 0, pageWidth, 20, 'F');
        doc.setFontSize(16);
        doc.setTextColor(255, 255, 255);
        doc.text(`${record.degree_name} Certificate`, pageWidth / 2, 12, { align: 'center' });

        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Institution: ${record.institution_name}`, pageWidth / 2, 30, { align: 'center' });
        doc.text(`Passing Year: ${record.passing_year}`, pageWidth / 2, 40, { align: 'center' });

        await loadAndAddImage(
            doc,
            record.certificate,
            (pageWidth - 160) / 2,
            50,
            160,
            100,
            `${record.degree_name} Certificate`
        );
        doc.setFontSize(10);
        doc.text(
            'This is a verified copy of the original certificate.',
            pageWidth / 2,
            160,
            { align: 'center' }
        );
      }
    }
  } else {
    autoTable(doc, {
      startY: 30,
      head: [['Message']],
      body: [['No educational records found.']],
      theme: 'grid',
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255], fontSize: 10 },
      styles: { fontSize: 9, halign: 'center' },
      margin: { left: margin, right: margin }
    });
  }

  // Medical Information Page
  doc.addPage();
  doc.setFillColor(0, 51, 102);
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('Medical Information', pageWidth / 2, 12, { align: 'center' });

  if (student.medical_info) {
    const medicalInfo = student.medical_info;
    const diseasesList = medicalInfo.diseases_list && medicalInfo.diseases_list.length > 0
        ? medicalInfo.diseases_list.join(', ')
        : 'None';

    autoTable(doc, {
      startY: 30,
      head: [['Field', 'Value']],
      body: [
        ['Blood Group', medicalInfo.blood_group_name || 'N/A'],
        ['Disabled', medicalInfo.is_disabled ? 'Yes' : 'No'],
        ['Diseases', diseasesList]
      ],
      theme: 'grid',
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255], fontSize: 10 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 60 },
        1: { cellWidth: 'auto' }
      },
      styles: { fontSize: 9, cellPadding: 2 },
      margin: { left: margin, right: margin }
    });
  } else {
    autoTable(doc, {
      startY: 30,
      head: [['Message']],
      body: [['No medical information found.']],
      theme: 'grid',
      headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255], fontSize: 10 },
      styles: { fontSize: 9, halign: 'center' },
      margin: { left: margin, right: margin }
    });
  }

  // Additional Documents Page
  if (application.additional_documents && application.additional_documents.length > 0) {
    doc.addPage();
    doc.setFillColor(0, 51, 102);
    doc.rect(0, 0, pageWidth, 20, 'F');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('Additional Documents', pageWidth / 2, 12, { align: 'center' });

    let currentY = 30;
    for (const doc_item of application.additional_documents) {
      if (currentY > pageHeight - 130) {
        doc.addPage();
        doc.setFillColor(0, 51, 102);
        doc.rect(0, 0, pageWidth, 20, 'F');
        doc.setFontSize(16);
        doc.setTextColor(255, 255, 255);
        doc.text('Additional Documents (Continued)', pageWidth / 2, 12, { align: 'center' });
        currentY = 30;
      }

      doc.setFontSize(12);
      doc.setTextColor(0, 51, 102);
      doc.text(doc_item.document_type || 'Document', pageWidth / 2, currentY, { align: 'center' });
      currentY += 10;

      if (doc_item.file_url) {
        await loadAndAddImage(
            doc,
            doc_item.file_url,
            (pageWidth - 160) / 2,
            currentY,
            160,
            100,
            doc_item.document_type || 'Document'
        );
        currentY += 120;
      } else {
        doc.setFontSize(10);
        doc.setTextColor(255, 0, 0);
        doc.text('Document image not available', pageWidth / 2, currentY + 20, { align: 'center' });
        currentY += 40;
      }
    }
  }

  // Declaration and Signature Page
  doc.addPage();
  doc.setFillColor(0, 51, 102);
  doc.rect(0, 0, pageWidth, 20, 'F');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('Declaration and Signature', pageWidth / 2, 12, { align: 'center' });

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  const declarationText = [
    'I, the undersigned, hereby declare that all information provided in this application, including personal, educational,',
    'medical, and contact details, is true, accurate, and complete to the best of my knowledge and belief.',
    'I understand that providing false, misleading, or fabricated information, including forged documents, is a serious offense',
    'under the Pakistan Penal Code (PPC) Sections 420 (cheating), 468 (forgery for the purpose of cheating), and 471',
    '(using as genuine a forged document), which may lead to criminal prosecution, fines, and/or imprisonment.',
    'I acknowledge that any misrepresentation or omission of material facts may result in the immediate rejection of my',
    'application, cancellation of admission, or disciplinary action as per the institution’s regulations.',
    'I certify that all submitted documents, including CNIC, educational certificates, and additional documents, are authentic',
    'and have not been altered or falsified in any manner.',
    'I agree to comply with all rules, regulations, and policies of the institution, including academic, financial, and',
    'disciplinary requirements, as outlined in the institution’s prospectus and governing documents.',
    'I understand that the institution reserves the right to verify all provided information with relevant authorities,',
    'including but not limited to NADRA, educational boards, and other regulatory bodies.',
    'I acknowledge that any discrepancies found during verification may lead to legal consequences under applicable laws.',
    'I undertake to promptly notify the institution of any changes to the information provided in this application.',
    'I agree that the institution may share my information with relevant authorities for verification purposes as required by law.',
    'I understand that submitting fraudulent documents or information may result in a permanent ban from applying to this',
    'institution and may be reported to the Higher Education Commission (HEC) and other relevant authorities.',
    'I certify that I have read and understood all terms and conditions of the admission process, and I accept full',
    'responsibility for the accuracy and authenticity of the information provided.',
    'I acknowledge that legal action may be initiated against me under the laws of Pakistan if any cheating, fraud, or',
    'misrepresentation is discovered, including but not limited to civil and criminal proceedings.',
    'I agree to indemnify the institution against any claims arising from the use of false or misleading information.',
    'I confirm that I have not been convicted of any offense involving moral turpitude or fraud that would disqualify me',
    'from admission under the institution’s policies or Pakistani law.',
    'I understand that this declaration is legally binding, and any breach may result in legal and academic consequences.',
    'I solemnly affirm that this application is submitted in good faith, with full awareness of my obligations and the',
    'potential consequences of non-compliance.',
    'I solemnly affirm that I believe in the finality of Prophethood (Khatm-e-Nabuwwat) and that Prophet Muhammad (peace be upon him) is the last and final messenger of Allah.',

  ];

  let yPos = 30;
  declarationText.forEach(line => {
    doc.text(line, margin, yPos, { maxWidth: pageWidth - margin * 2 });
    yPos += 7;
  });

  yPos += 15;
  doc.line(margin, yPos, margin + 80, yPos);
  doc.text('Applicant Signature', margin + 40, yPos + 8, { align: 'center' });

  doc.line(pageWidth - margin - 80, yPos, pageWidth - margin, yPos);
  doc.text('Official Signature & Stamp', pageWidth - margin - 40, yPos + 8, { align: 'center' });

  yPos += 20;
  doc.text(`Date: ${new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })}`, margin, yPos);

  // Add QR Code on First Page
  if (application.application_qrcode) {
    await loadAndAddImage(
      doc,
      application.application_qrcode,
      pageWidth - 45,
      20,
      25,
      25,
      ''
    );
    doc.setPage(1);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text('Scan to verify', pageWidth - 32.5, 48, { align: 'center' });
  }

  // Add footer to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text(
        `Page ${i} of ${totalPages} | Official Document - College Admission Management System`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
    );
  }

  // Save PDF with sanitized filename
  const studentName = `${user.first_name}_${user.last_name}`.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`${application.tracking_id}_${studentName}.pdf`);
};