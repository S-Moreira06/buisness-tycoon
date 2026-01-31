import { useHeaderHeight } from '@react-navigation/elements';
import { BlurView } from 'expo-blur';
import React, { useEffect } from 'react';
import { BackHandler, Pressable, StyleSheet, View } from 'react-native';
import { Portal } from 'react-native-paper';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';

interface CustomModalProps {
  visible: boolean;
  onDismiss: () => void;
  children: React.ReactNode;
}

export const CustomModal = ({ visible, onDismiss, children }: CustomModalProps) => {
  const headerHeight = useHeaderHeight();

    // Gérer le bouton retour Android
  useEffect(() => {
    const onBackPress = () => {
      if (visible) {
        onDismiss();
        return true;
      }
      return false;
    };

    // CORRECTION : On stocke la souscription
    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    // Et on appelle .remove() sur la souscription au lieu de passer par BackHandler
    return () => backHandler.remove();
  }, [visible, onDismiss]);


  if (!visible) return null;

  return (
    <Portal>
      {/*
        Le conteneur principal couvre tout l'écran mais laisse passer les clics
        sur la zone du header grâce au marginTop et pointerEvents
      */}
      <View style={[styles.container, { top: headerHeight }]} pointerEvents="box-none">

        {/* L'overlay sombre (Backdrop) */}
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={StyleSheet.absoluteFill}
        >
          <Pressable style={styles.backdrop} onPress={onDismiss} />
        </Animated.View>

        {/* Le contenu de la modale */}
        <Animated.View
          entering={SlideInDown.springify().damping(60)}
          exiting={SlideOutDown.duration(200)}
          style={styles.contentWrapper}
          pointerEvents="box-none"
        >
          {/*
            On applique le BlurView ici pour qu'il soit coupé (overflow hidden)
            selon le radius défini par le composant enfant ou celui-ci.
            Ici, on crée un conteneur "Glass" générique.
          */}
          <BlurView intensity={20} tint="dark" style={styles.modalCard}>
             {children}
          </BlurView>
        </Animated.View>
      </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    // Permet de centrer le contenu verticalement dans l'espace restant
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)', // Assombri légèrement pour le contraste
  },
  contentWrapper: {
    width: '90%',
    maxWidth: 400,
    maxHeight: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    borderRadius: 24, // Radius unifié pour toutes les modales
    overflow: 'hidden',
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
});
