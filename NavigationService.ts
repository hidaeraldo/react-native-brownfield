import { CommonActions, StackActions } from '@react-navigation/native';
let _navigator: any;

function setTopLevelNavigator(navigatorRef: any) {
  _navigator = navigatorRef;
}

function getnavigator() {
  return _navigator;
}

function navigate(routeName: string, params?: any) {
  _navigator.dispatch(
    CommonActions.navigate({
      name: routeName,
      params: params,
    })
  );
}

function replace(routeName: string, params?: any) {
  _navigator.dispatch(StackActions.replace(routeName, params));
}

function goBack(target?: string) {
  try {
    if (_navigator.canGoBack()) {
      _navigator.dispatch(
        target ? StackActions.popTo(target) : StackActions.pop(1)
      );
    } else {
      try {
        _navigator.navigate(target);
      } catch (error) {
        throw new Error();
      }
    }
  } catch (error) {
    throw new Error();
  }
}

async function stackFirst(routeName: string, params: any = {}) {
  _navigator.dispatch(
    CommonActions.reset({
      index: 0,
      routes: [{ name: routeName, params: params }],
    })
  );
}

async function pop(index: number) {
  _navigator.dispatch(StackActions.pop(index));
}

async function popToTop() {
  _navigator.dispatch(StackActions.popToTop());
}

async function naviagteToMany(routes: any, index: any) {
  if (_navigator) {
    _navigator?.dispatch(
      CommonActions.reset({
        index: index,
        routes: routes,
      })
    );
  }
}

export default {
  getnavigator,
  setTopLevelNavigator,
  navigate,
  goBack,
  stackFirst,
  replace,
  pop,
  popToTop,
  naviagteToMany,
};
