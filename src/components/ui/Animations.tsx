import React, { useEffect, useRef } from 'react';
import { Animated, Easing, ViewStyle } from 'react-native';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: ViewStyle;
}

export function FadeIn({ children, delay = 0, duration = 500, style }: FadeInProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[{ opacity }, style]}>
      {children}
    </Animated.View>
  );
}

interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  style?: ViewStyle;
}

export function SlideIn({
  children,
  direction = 'up',
  delay = 0,
  duration = 500,
  style,
}: SlideInProps) {
  const translate = useRef(new Animated.Value(100)).current;

  useEffect(() => {
    Animated.timing(translate, {
      toValue: 0,
      duration,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  const getTransform = () => {
    switch (direction) {
      case 'left':
        return [{ translateX: translate }];
      case 'right':
        return [{ translateX: translate.interpolate({
          inputRange: [0, 100],
          outputRange: [0, 100],
        }) }];
      case 'down':
        return [{ translateY: translate.interpolate({
          inputRange: [0, 100],
          outputRange: [0, 100],
        }) }];
      default:
        return [{ translateY: translate }];
    }
  };

  return (
    <Animated.View style={[{ transform: getTransform() }, style]}>
      {children}
    </Animated.View>
  );
}

interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  style?: ViewStyle;
}

export function ScaleIn({ children, delay = 0, duration = 300, style }: ScaleInProps) {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[{ transform: [{ scale }], opacity }, style]}>
      {children}
    </Animated.View>
  );
}

interface PulseProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Pulse({ children, style }: PulseProps) {
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      {children}
    </Animated.View>
  );
}

interface ShakeProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Shake({ children, style }: ShakeProps) {
  const shake = useRef(new Animated.Value(0)).current;

  const startShake = () => {
    Animated.sequence([
      Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 10, duration: 50, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 50, useNativeDriver: true }),
    ]).start();
  };

  return (
    <Animated.View
      style={[{ transform: [{ translateX: shake }] }, style]}
      onLayout={startShake}
    >
      {children}
    </Animated.View>
  );
}

interface CountUpProps {
  value: number;
  duration?: number;
  style?: any;
  prefix?: string;
  suffix?: string;
}

export function CountUp({ value, duration = 1000, style, prefix = '', suffix = '' }: CountUpProps) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    animatedValue.setValue(0);
    Animated.timing(animatedValue, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();

    const listener = animatedValue.addListener(({ value: val }) => {
      setDisplayValue(Math.round(val));
    });

    return () => animatedValue.removeListener(listener);
  }, [value]);

  return (
    <Animated.Text style={style}>
      {prefix}{displayValue.toLocaleString('pt-BR')}{suffix}
    </Animated.Text>
  );
}
