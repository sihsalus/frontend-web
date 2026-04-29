import {
  cancerPreventionDashboardMeta,
  familyPlanningDashboardMeta,
  labourAndDeliveryDashboardMeta,
  maternalAndChildHealthNavGroup,
  postnatalDashboardMeta,
  prenatalDashboardMeta,
} from './dashboard.meta';

describe('maternal-and-child-health dashboard meta', () => {
  it('keeps all dashboard registrations pointed at the maternal health module', () => {
    const dashboards = [
      prenatalDashboardMeta,
      labourAndDeliveryDashboardMeta,
      postnatalDashboardMeta,
      familyPlanningDashboardMeta,
      cancerPreventionDashboardMeta,
    ];

    dashboards.forEach((dashboard) => {
      expect(dashboard.moduleName).toBe('@sihsalus/esm-salud-materna-app');
      expect(dashboard.path).toBeTruthy();
      expect(dashboard.slot).toContain('patient-chart');
    });
  });

  it('exposes the Madre Gestante navigation group with the expected visibility rule', () => {
    expect(maternalAndChildHealthNavGroup).toEqual(
      expect.objectContaining({
        title: 'Madre Gestante',
        slotName: 'maternal-and-child-health-slot',
        isExpanded: true,
      }),
    );
    expect(maternalAndChildHealthNavGroup.showWhenExpression).toContain('patient.gender === "female"');
    expect(maternalAndChildHealthNavGroup.showWhenExpression).toContain('Madre Gestante');
  });
});
