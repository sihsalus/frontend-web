import { useOnClickOutside } from '@openmrs/esm-framework';
import React, { useEffect } from 'react';

interface VisitHeaderSideMenuProps {
  isExpanded: boolean;
  toggleSideMenu: (isExpanded: boolean) => void;
}

const LEFT_NAV_EXPANDED_CLASS = 'omrs-patient-chart-left-nav-expanded';

const VisitHeaderSideMenu: React.FC<VisitHeaderSideMenuProps> = ({ isExpanded, toggleSideMenu }) => {
  const menuRef = useOnClickOutside(() => toggleSideMenu(false), isExpanded);

  // Toggle the framework's existing sidebar visibility via CSS class
  // instead of rendering a second LeftNavMenu that conflicts
  useEffect(() => {
    const container = document.getElementById('omrs-left-nav-container');
    if (container) {
      if (isExpanded) {
        container.classList.add(LEFT_NAV_EXPANDED_CLASS);
      } else {
        container.classList.remove(LEFT_NAV_EXPANDED_CLASS);
      }
    }
    return () => {
      container?.classList.remove(LEFT_NAV_EXPANDED_CLASS);
    };
  }, [isExpanded]);

  useEffect(() => {
    const popstateHandler = () => toggleSideMenu(false);
    window.addEventListener('popstate', popstateHandler);
    return () => window.removeEventListener('popstate', popstateHandler);
  }, [toggleSideMenu]);

  // Attach ref to the container for click-outside detection
  useEffect(() => {
    const container = document.getElementById('omrs-left-nav-container');
    if (menuRef && 'current' in menuRef) {
      (menuRef as React.MutableRefObject<HTMLElement | null>).current = container;
    }
  }, [menuRef]);

  return null;
};

export default VisitHeaderSideMenu;
