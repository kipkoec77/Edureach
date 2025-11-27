export default function showToast(message, type = 'info', timeout = 3500){
  try{
    const id = 'edureach-toast-' + Date.now();
    const el = document.createElement('div');
    el.id = id;
    el.style.position = 'fixed';
    el.style.right = '20px';
    el.style.top = '20px';
    el.style.zIndex = 9999;
    el.style.background = type === 'error' ? '#fee2e2' : (type === 'success' ? '#ecfdf5' : '#f0f9ff');
    el.style.color = '#111827';
    el.style.border = '1px solid rgba(0,0,0,0.06)';
    el.style.padding = '10px 14px';
    el.style.borderRadius = '8px';
    el.style.boxShadow = '0 6px 18px rgba(0,0,0,0.06)';
    el.style.fontSize = '14px';
    el.innerText = message;
    document.body.appendChild(el);
    setTimeout(()=>{ el.style.transition = 'opacity 300ms'; el.style.opacity = '0'; setTimeout(()=>el.remove(), 300)}, timeout);
  } catch(e){ /* ignore DOM errors during SSR */ }
}
