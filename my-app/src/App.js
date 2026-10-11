import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "./api";
import Header from "./Header";
import Banner from "./Banner";
import Content from "./Content";
import ArtifactManager from "./ArtifactManager";
import Footer from "./Footer";

function App() {
  const [favorites, setFavorites] = useState(() => {
    try {
      const savedFavorites = JSON.parse(localStorage.getItem("favorite-artifacts") || "[]");
      return Array.isArray(savedFavorites) ? savedFavorites : [];
    } catch {
      return [];
    }
  });
  const [favoriteProfileIds, setFavoriteProfileIds] = useState(() => {
    try {
      const savedProfiles = JSON.parse(localStorage.getItem("favorite-profiles") || "[]");
      return Array.isArray(savedProfiles) ? savedProfiles : [];
    } catch {
      return [];
    }
  });
  const [users, setUsers] = useState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [showArtifactManager, setShowArtifactManager] = useState(false);
  const [initialArtifact, setInitialArtifact] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [authToken, setAuthToken] = useState(() => localStorage.getItem("admin-auth-token"));
  const [authUser, setAuthUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(() => Boolean(localStorage.getItem("admin-auth-token")));

  useEffect(() => {
    let isCurrent = true;
    Promise.all([
      axios.get("https://jsonplaceholder.typicode.com/users"),
      axios.get(`${API_BASE_URL}/profiles`).catch(() => ({ data: [] })),
    ]).then(([{ data: remoteUsers }, { data: overrides }]) => {
      const overridesById = new Map(overrides.map((profile) => [profile.id, profile]));
      const mergedUsers = remoteUsers.map((user) => {
        const profile = overridesById.get(user.id);
        if (!profile) return user;
        return {
          ...user,
          name: profile.name,
          email: profile.email,
          phone: profile.phone,
          website: profile.website,
          image: profile.imageData,
          company: { ...user.company, name: profile.companyName },
          address: { ...user.address, street: profile.street, city: profile.city },
        };
      });
      if (isCurrent) setUsers(mergedUsers);
    }).catch(() => {});

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/artifacts`).then(({ data }) => {
      setArtifacts(data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    localStorage.setItem("favorite-artifacts", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("favorite-profiles", JSON.stringify(favoriteProfileIds));
  }, [favoriteProfileIds]);

  useEffect(() => {
    if (!authToken) {
      setAuthUser(null);
      setAuthChecking(false);
      return undefined;
    }

    let isCurrentSession = true;
    setAuthChecking(true);
    axios.get(`${API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${authToken}` },
    }).then(({ data }) => {
      if (isCurrentSession) setAuthUser(data);
    }).catch(() => {
      localStorage.removeItem("admin-auth-token");
      if (isCurrentSession) {
        setAuthToken(null);
        setAuthUser(null);
      }
    }).finally(() => {
      if (isCurrentSession) setAuthChecking(false);
    });

    return () => {
      isCurrentSession = false;
    };
  }, [authToken]);

  const handleAuthenticated = ({ access_token: accessToken, user }) => {
    localStorage.setItem("admin-auth-token", accessToken);
    setAuthToken(accessToken);
    setAuthUser(user);
    setAuthChecking(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-auth-token");
    setAuthToken(null);
    setAuthUser(null);
  };

  const toggleFavorite = (image) => {
    setFavorites((currentFavorites) =>
      currentFavorites.includes(image)
        ? currentFavorites.filter((favorite) => favorite !== image)
        : [...currentFavorites, image]
    );
  };

  const toggleProfileFavorite = (userId) => {
    setFavoriteProfileIds((currentIds) =>
      currentIds.includes(userId)
        ? currentIds.filter((id) => id !== userId)
        : [...currentIds, userId]
    );
  };

  const updateArtifacts = useCallback((nextArtifacts) => {
    setArtifacts(nextArtifacts);
    setFavorites((currentFavorites) => currentFavorites.filter((favorite) =>
      !favorite.startsWith("artifact:") || nextArtifacts.some((artifact) => `artifact:${artifact.id}` === favorite)
    ));
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUsers((currentUsers) => currentUsers.map((user) =>
      user.id === updatedUser.id ? updatedUser : user
    ));
    setSelectedUser((currentUser) =>
      currentUser?.id === updatedUser.id ? updatedUser : currentUser
    );
  }, []);

  const openArtifactManager = (artifact = null) => {
    setInitialArtifact(artifact);
    setShowArtifactManager(true);
  };

  const favoriteProfiles = users.filter((user) => favoriteProfileIds.includes(user.id));

  return (
    <>
      <Header
        favorites={favorites}
        favoriteProfiles={favoriteProfiles}
        favoriteProfileCount={favoriteProfileIds.length}
        artifacts={artifacts}
        onArtifactsChange={updateArtifacts}
        onOpenArtifactManager={openArtifactManager}
        onToggleFavorite={toggleFavorite}
        onToggleProfileFavorite={toggleProfileFavorite}
        onOpenProfile={setSelectedUser}
        authToken={authToken}
        authUser={authUser}
        authChecking={authChecking}
        onAuthenticated={handleAuthenticated}
        onLogout={handleLogout}
      />
      <Banner
        artifacts={artifacts}
        favorites={favorites}
        isAdmin={authUser?.role === "admin"}
        onEditArtifact={openArtifactManager}
        onToggleFavorite={toggleFavorite}
      />
      <Content
        users={users}
        isAdmin={authUser?.role === "admin"}
        authToken={authToken}
        favoriteProfileIds={favoriteProfileIds}
        selectedUser={selectedUser}
        onUpdateUser={updateUser}
        onToggleProfileFavorite={toggleProfileFavorite}
        onOpenProfile={setSelectedUser}
        onCloseProfile={() => setSelectedUser(null)}
      />
      {authUser?.role === "admin" && (
        <ArtifactManager
          show={showArtifactManager}
          onHide={() => setShowArtifactManager(false)}
          token={authToken}
          artifacts={artifacts}
          initialArtifact={initialArtifact}
          onArtifactsChange={updateArtifacts}
        />
      )}
      <Footer />
    </>
  );
}

export default App;