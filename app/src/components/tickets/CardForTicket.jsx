import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Typography from "@mui/joy/Typography";
import Box from "@mui/joy/Box";

const CardForTicket = ({ object, width = "90px", height = "auto" }) => {
  const { name, picture } = object;

  return (
    <Card
    title={name}
      sx={{
        position: "relative",
        zIndex: 0,
        width,
        height,
        boxShadow: "0px 1px 4px 0px rgba(11, 1, 41, 0.35)",
        outline: "solid 2px transparent",
        overflow: "hidden",
        padding: 0, 
        margin: 0,
      }}
    >
      <CardOverflow sx={{ position: "relative", padding: 0, margin: 0 }}>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
            padding: 0,
            margin: 0,
          }}
        >
          <img
            src={picture || "/images/error-img.webp"}
            loading="lazy"
            alt={name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/error-img.webp";
            }}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              margin: 0,
              padding: 0,
              display: "block", // Évite tout espace blanc sous l’image
            }}
          />
        </Box>
      </CardOverflow>
      <CardContent sx={{ padding: 0, margin: 0 }}> 
        <Typography
          sx={{
            color: "var(--joy-palette-primary-900)",
            fontWeight: "lg",
            fontSize: "0.625rem",
            textAlign: "center",
            padding: 0,
            paddingBottom: "5px",
            margin: 0,
            display: "block",
          }}
          level="title-sm"
        >
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CardForTicket;
