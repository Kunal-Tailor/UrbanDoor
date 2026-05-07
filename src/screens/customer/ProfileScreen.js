/**
 * ProfileScreen.js — Customer profile with photo upload, edit, and logout
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import COLORS from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/Input';
import Button from '../../components/Button';

const ProfileScreen = ({ navigation }) => {
  const { userData, logout, updateUserData } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(userData?.name || '');
  const [phone, setPhone] = useState(userData?.phone || '');
  const [profileImage, setProfileImage] = useState(userData?.profileImage || '');

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.7 });
    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    const result = await updateUserData({ name, phone, profileImage });
    if (result.success) {
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  const MenuItem = ({ icon, label, onPress, color = COLORS.textPrimary, showArrow = true }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={[styles.menuLabel, { color }]}>{label}</Text>
      {showArrow && <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <TouchableOpacity onPress={editing ? handlePickImage : null} style={styles.avatarContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}><Ionicons name="person" size={32} color={COLORS.textTertiary} /></View>
            )}
            {editing && (
              <View style={styles.cameraIcon}><Ionicons name="camera" size={14} color={COLORS.white} /></View>
            )}
          </TouchableOpacity>
          <Text style={styles.profileName}>{userData?.name || 'User'}</Text>
          <Text style={styles.profileEmail}>{userData?.email || ''}</Text>
          <TouchableOpacity style={styles.editBadge} onPress={() => setEditing(!editing)}>
            <Ionicons name={editing ? 'close' : 'create-outline'} size={14} color={COLORS.primary} />
            <Text style={styles.editText}>{editing ? 'Cancel' : 'Edit Profile'}</Text>
          </TouchableOpacity>
        </View>

        {/* Edit Form */}
        {editing && (
          <View style={styles.editForm}>
            <Input label="Full Name" value={name} onChangeText={setName} icon="person-outline" autoCapitalize="words" />
            <Input label="Phone Number" value={phone} onChangeText={setPhone} icon="call-outline" keyboardType="phone-pad" placeholder="+91 98765 43210" />
            <Button title="Save Changes" onPress={handleSave} icon="checkmark" />
          </View>
        )}

        {/* Menu Items */}
        {!editing && (
          <View style={styles.menu}>
            <MenuItem icon="location-outline" label="Saved Addresses" onPress={() => {}} />
            <MenuItem icon="card-outline" label="Payment Methods" onPress={() => {}} />
            <MenuItem icon="help-circle-outline" label="Help & Support" onPress={() => {}} />
            <MenuItem icon="information-circle-outline" label="About ServeNow" onPress={() => {}} />
            <View style={styles.menuDivider} />
            <MenuItem icon="log-out-outline" label="Logout" onPress={handleLogout} color={COLORS.error} showArrow={false} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 0) + 16, paddingBottom: 8 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary },
  profileCard: { alignItems: 'center', backgroundColor: COLORS.white, margin: 16, borderRadius: 20, padding: 24, shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 8, elevation: 3 },
  avatarContainer: { position: 'relative', marginBottom: 12 },
  avatar: { width: 80, height: 80, borderRadius: 28 },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 28, backgroundColor: COLORS.divider, alignItems: 'center', justifyContent: 'center' },
  cameraIcon: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.white },
  profileName: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  profileEmail: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  editBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: COLORS.primarySoft },
  editText: { fontSize: 12, fontWeight: '600', color: COLORS.primary, marginLeft: 4 },
  editForm: { padding: 16 },
  menu: { backgroundColor: COLORS.white, margin: 16, borderRadius: 16, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '500', marginLeft: 12 },
  menuDivider: { height: 8, backgroundColor: COLORS.divider },
});

export default ProfileScreen;
