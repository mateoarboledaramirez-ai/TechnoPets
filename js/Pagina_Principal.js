function initProfileWidget() {
      const fullName = (localStorage.getItem('tecnoUserFullName') || localStorage.getItem('tecnoUserName') || '').trim();
      if (!fullName) return;

      const profileWrap = document.getElementById('profile-wrap');
      const profileCircle = document.getElementById('profile-circle');
      const profileName = document.getElementById('profile-name');
      if (!profileWrap || !profileCircle || !profileName) return;

      const parts = fullName.split(/\s+/).filter(Boolean);
      const initials = parts.slice(0, 2).map(word => word[0].toUpperCase()).join('') || 'U';

      profileCircle.textContent = initials;
      profileName.textContent = fullName;
      profileWrap.style.display = 'flex';
    }

    document.addEventListener('DOMContentLoaded', initProfileWidget);
