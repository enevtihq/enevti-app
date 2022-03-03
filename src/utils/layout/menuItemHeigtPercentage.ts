import { MENU_ITEM_HEIGHT_PERCENTAGE } from '../../components/atoms/menu/AppMenuItem';

export const menuItemHeigtPercentage = (count: number) => {
  return MENU_ITEM_HEIGHT_PERCENTAGE * (count + 1);
};
