import idMapping from '../data/id-mapping.json';
import type { ToothPosition } from '../types';

export interface DualId {
  numericId: number;
  uuid: string;
}

export type EntityType = 'tooth' | 'space';

/**
 * Utilidad para convertir entre IDs numéricos y UUIDs
 * Soporta sistema dual de identificación para dientes y espacios
 */
export class IdUtils {
  private static getTeethMap(): Record<string, string> {
    return idMapping.teeth as Record<string, string>;
  }

  private static getSpacesMap(position: ToothPosition): Record<string, string> | null {
    return (idMapping.spaces as Record<string, Record<string, string>>)[position] ?? null;
  }

  /**
   * Obtiene el UUID de un diente basado en su ID numérico
   */
  static getToothUuid(numericId: number): string | null {
    const toothId = numericId.toString();
    return this.getTeethMap()[toothId] ?? null;
  }

  /**
   * Obtiene el ID numérico de un diente basado en su UUID
   */
  static getToothNumericId(uuid: string): number | null {
    const teeth = this.getTeethMap();
    for (const [numericId, toothUuid] of Object.entries(teeth)) {
      if (toothUuid === uuid) {
        return parseInt(numericId);
      }
    }
    return null;
  }

  /**
   * Obtiene el UUID de un espacio basado en su ID numérico y posición
   */
  static getSpaceUuid(numericId: number, position: ToothPosition): string | null {
    const spaceId = numericId.toString();
    const spaces = this.getSpacesMap(position);
    return spaces?.[spaceId] ?? null;
  }

  /**
   * Obtiene el ID numérico de un espacio basado en su UUID y posición
   */
  static getSpaceNumericId(uuid: string, position: ToothPosition): number | null {
    const spaces = this.getSpacesMap(position);
    if (!spaces) return null;

    for (const [numericId, spaceUuid] of Object.entries(spaces)) {
      if (spaceUuid === uuid) {
        return parseInt(numericId, 10);
      }
    }
    return null;
  }

  /**
   * Convierte un ID numérico a objeto DualId
   */
  static toDualId(numericId: number, type: EntityType, position?: ToothPosition): DualId | null {
    if (type === 'tooth') {
      const uuid = this.getToothUuid(numericId);
      return uuid ? { numericId, uuid } : null;
    }

    if (type === 'space' && position) {
      const uuid = this.getSpaceUuid(numericId, position);
      return uuid ? { numericId, uuid } : null;
    }

    return null;
  }

  /**
   * Convierte un UUID a objeto DualId
   */
  static fromDualId(uuid: string, type: EntityType, position?: ToothPosition): DualId | null {
    if (type === 'tooth') {
      const numericId = this.getToothNumericId(uuid);
      return numericId !== null ? { numericId, uuid } : null;
    }

    if (type === 'space' && position) {
      const numericId = this.getSpaceNumericId(uuid, position);
      return numericId !== null ? { numericId, uuid } : null;
    }

    return null;
  }

  /**
   * Valida si un UUID existe en el mapeo
   */
  static isValidUuid(uuid: string, type: EntityType, position?: ToothPosition): boolean {
    if (type === 'tooth') {
      return Object.values(this.getTeethMap()).includes(uuid);
    }

    if (type === 'space' && position) {
      return Object.values(this.getSpacesMap(position) ?? {}).includes(uuid);
    }

    return false;
  }

  /**
   * Obtiene todos los UUIDs de dientes de una posición específica
   */
  static getToothUuidsByPosition(position: ToothPosition): string[] {
    const teeth = this.getTeethMap();
    const uuids: string[] = [];

    for (const [numericId, uuid] of Object.entries(teeth)) {
      const numId = parseInt(numericId, 10);
      if (position === 'upper' && (numId >= 11 && numId <= 28)) {
        uuids.push(uuid);
      } else if (position === 'lower' && (numId >= 31 && numId <= 48)) {
        uuids.push(uuid);
      }
    }
    
    return uuids;
  }

  /**
   * Obtiene todos los UUIDs de espacios de una posición específica
   */
  static getSpaceUuidsByPosition(position: ToothPosition): string[] {
    const spaces = this.getSpacesMap(position);
    return spaces ? Object.values(spaces) : [];
  }
} 