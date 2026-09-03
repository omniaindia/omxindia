// 1. Supabase Initialization
const SUPABASE_URL = 'https://zzexmtgabcdordnlvydc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Kaww3DjKSJIRo8b6mZxShg_4O9ibgn5';

// Supabase Client
var supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// 2. Payment Gateway Links (Passing file parameters to redirect/success page)
const paymentLinks = {
  'html_notes': 'https://razorpay.me/@omniaindia?file=html',
  'css_notes': 'https://razorpay.me/@omniaindia?file=css',
  'js_notes': 'https://razorpay.me/@omniaindia?file=js'
};

// 3. Buy Now Function
function buyNow(productId) {
  const link = paymentLinks[productId];

  if (link) {
    // Direct Razorpay payment page par bhejega
    window.location.href = link;
  } else {
    alert("Payment link not found for this product!");
  }
}

// 4. Safe Filter Function
function filterStore(category, btnElement) {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => btn.classList.remove('active'));
  
  if (btnElement) {
    btnElement.classList.add('active');
  }

  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    if (category === 'all' || card.getAttribute('data-category') === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// 5. Preview Modal Functions
function openPreview(title, pdfPath) {
  const modal = document.getElementById('previewModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');

  if (!modal || !modalTitle || !modalBody) return;

  modalTitle.innerText = title;

  // PDF Preview Display Code
  modalBody.innerHTML = `
    <iframe 
      src="${pdfPath}" 
      width="100%" 
      height="450px" 
      style="border: none; margin-top: 10px; border-radius: 6px;">
    </iframe>
  `;

  modal.style.display = 'flex';
}

function closePreview() {
  const modal = document.getElementById('previewModal');
  const modalBody = document.getElementById('modalBody');
  
  if (modal) modal.style.display = 'none';
  if (modalBody) modalBody.innerHTML = ''; // Memory clear karne ke liye
}

// Modal ke bahar click karne par close hoga
window.onclick = function(event) {
  const modal = document.getElementById('previewModal');
  if (event.target === modal) {
    closePreview();
  }
};

// 6. Secure Supabase Download Function (Dynamic File Handling)
async function downloadNote(customFileName) {
  try {
    let targetFile = customFileName;

    // Agar URL me file param pass hua hai (Success page par)
    if (!targetFile) {
      const urlParams = new URLSearchParams(window.location.search);
      const fileParam = urlParams.get('file');

      if (fileParam && fileParam.toLowerCase().includes('css')) {
        targetFile = 'CSS NOTES.pdf';
      } else {
        targetFile = 'html.pdf'; // Default HTML
      }
    }

    // Exact bucket name 'notes file' se signed URL generate hoga
    const { data, error } = await supabase
      .storage
      .from('notes file')
      .createSignedUrl(targetFile, 60 * 15); // 15 Minutes Validity

    if (error) {
      console.error("Supabase Error:", error);
      alert("Download error: " + error.message);
      return;
    }

    // Direct File Download Trigger
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = data.signedUrl;
    downloadAnchor.download = targetFile;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

  } catch (err) {
    console.error("Unexpected Error:", err);
  }
}