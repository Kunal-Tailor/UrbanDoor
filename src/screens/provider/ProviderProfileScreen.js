/**
 * ProviderProfileScreen.js — Provider profile with availability toggle, skills, and logout
 */
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Switch, Alert, StyleSheet, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import COLORS from '../../constants/colors';
import { useAuth } from '../../context/AuthContext';
import StarRating from '../../components/StarRating';
import Input from '../../components/Input';
import Button from '../../components/Button';

const ProviderProfileScreen = () => {
  const { userData, logout, updateUserData } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(userData?.name || '');
  const [phone, setPhone] = useState(userData?.phone || '');
  const [isOnline, setIsOnline] = useState(userData?.isOnline || false);
  const [profileImage, setProfileImage] = useState(userData?.profileImage || '');

  const handleToggleOnline = async (value) => {
    setIsOnline(value);
    await updateUserData({ isOnline: value });
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.7 });
    if (!result.canceled) setProfileImage(result.assets[0].uri);
  };

  const handleSave = async () => {
    const result = await updateUserData({ name, phone, profileImage });
    if (result.success) { setEditing(false); Alert.alert('Success', 'Profile updated!'); }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}><Text style={styles.title}>Profile</Text></View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <TouchableOpacity onPress={editing ? handlePickImage : null} style={styles.avatarWrap}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}><Ionicons name="person" size={32} color={COLORS.textTertiary} /></View>
            )}
            {editing && <View style={styles.camIcon}><Ionicons name="camera" size={14} color={COLORS.white} /></View>}
          </TouchableOpacity>
          <Text style={styles.profileName}>{userData?.name || 'Provider'}</Text>
          <StarRating rating={userData?.rating || 4.8} showLabel style={{ marginTop: 4 }} />
          <Text style={styles.profileStats}>{userData?.completedJobs || 0} jobs • {userData?.experience || 'N/A'}</Text>
        </View>

        {/* Online Toggle */}
        <View style={styles.onlineCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.onlineLabel}>Availability</Text>
            <Text style={styles.onlineDesc}>{isOnline ? 'You are visible to customers' : 'You are hidden from customers'}</Text>
          </View>
          <Switch value={isOnline} onValueChange={handleToggleOnline} trackColor={{ false: COLORS.border, true: COLORS.successLight }}
            thumbColor={isOnline ? COLORS.success : COLORS.textTertiary} />
        </View>

        {/* Edit / Menu */}
        {editing ? (
          <View style={styles.editForm}>
            <Input label="Full Name" value={name} onChangeText={setName} icon="person-outline" autoCapitalize="words" />
            <Input label="Phone" value={phone} onChangeText={setPhone} icon="call-outline" keyboardType="phone-pad" />
            <Button title="Save Changes" onPress={handleSave} icon="checkmark" />
            <Button title="Cancel" variant="ghost" onPress={() => setEditing(false)} style={{ marginTop: 8 }} />
          </View>
        ) : (
          <View style={styles.menu}>
            <MenuItem icon="create-outline" label="Edit Profile" onPress={() => setEditing(true)} />
            <MenuItem icon="construct-outline" label="My Services" onPress={() => {}} />
            <MenuItem icon="help-circle-outline" label="Support" onPress={() => {}} />
            <View style={{ height: 8, backgroundColor: COLORS.divider }} />
            <MenuItem icon="log-out-outline" label="Logout" onPress={handleLogout} color={COLORS.error} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const MenuItem = ({ icon, label, onPress, color = COLORS.textPrimary }) => (
  <TouchableOpacity style={miStyles.item} onPress={onPress} activeOpacity={0.7}>
    <Ionicons name={icon} size={22} color={color} />
    <Text style={[miStyles.label, { color }]}>{label}</Text>
    <Ionicons name="chevron-forward" size={18} color={COLORS.textTertiary} />
  </TouchableOpacity>
);

const miStyles = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
  label: { flex: 1, fontSize: 15, fontWeight: '500', marginLeft: 12 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : (StatusBar.currentHeight || 0) + 16, paddingBottom: 8 },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary },
  profileCard: { alignItems: 'center', backgroundColor: COLORS.white, margin: 16, borderRadius: 20, padding: 24 },
  avatarWrap: { marginBottom: 12 },
  avatar: { width: 80, height: 80, borderRadius: 28 },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 28, backgroundColor: COLORS.divider, alignItems: 'center', justifyContent: 'center' },
  camIcon: { position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: COLORS.white },
  profileName: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary },
  profileStats: { fontSize: 13, color: COLORS.textTertiary, marginTop: 8 },
  onlineCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, marginHorizontal: 16, borderRadius: 14, padding: 16, marginBottom: 16 },
  onlineLabel: { fontSize: 15, fontWeight: '600', color: COLORS.textPrimary },
  onlineDesc: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  editForm: { padding: 16 },
  menu: { backgroundColor: COLORS.white, margin: 16, borderRadius: 16, overflow: 'hidden' },
});

export default ProviderProfileScreen;
