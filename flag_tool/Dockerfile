FROM mcr.microsoft.com/dotnet/core/runtime:3.1 as base
RUN mkdir /flag_tool

# BUILD
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 AS build
WORKDIR /build
COPY . .
RUN dotnet restore "flag_tool.csproj"
RUN dotnet build "flag_tool.csproj" -c Release -o /app

# COMPILE
FROM build AS publish
RUN dotnet publish "flag_tool.csproj" -c Release -o /app				
COPY bin /app

# RUNTIME
FROM base AS final
WORKDIR /app
COPY --from=publish /app .														
CMD '/bin/bash'