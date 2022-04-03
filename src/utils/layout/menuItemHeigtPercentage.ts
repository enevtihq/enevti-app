import { MENU_ITEM_HEIGHT_PERCENTAGE } from 'enevti-app/components/atoms/menu/AppMenuItem';

export const menuItemHeigtPercentage = (count: number) => {
  return MENU_ITEM_HEIGHT_PERCENTAGE * (count + 1);
};
