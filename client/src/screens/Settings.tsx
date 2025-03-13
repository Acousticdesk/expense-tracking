import { Layout } from "@/components/Layout";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import {
  fetchUserProfile,
  getUsernameFromUserProfile,
  removeAccessToken,
} from "@/lib/services/auth.service";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function Settings() {
  const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: fetchUserProfile,
  });

  const navigate = useNavigate();

  const username = userProfile
    ? getUsernameFromUserProfile(userProfile)
    : undefined;

  return (
    <Layout>
      <Container className="flex-auto">
        <div className="py-2">
          <p className="mb-4 text-xl">{isUserProfileLoading ? "Loading..." : `Hello, ${username}`}</p>
          <Button variant="destructive" onClick={() => {
            removeAccessToken();
            navigate("/");
            
          }}>Sign Out</Button>
        </div>
      </Container>
    </Layout>
  );
}
