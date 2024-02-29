import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IStop } from '../stop.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../stop.test-samples';

import { StopService } from './stop.service';

const requireRestSample: IStop = {
  ...sampleWithRequiredData,
};

describe('Stop Service', () => {
  let service: StopService;
  let httpMock: HttpTestingController;
  let expectedResult: IStop | IStop[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(StopService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Stop', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const stop = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(stop).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Stop', () => {
      const stop = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(stop).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Stop', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Stop', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Stop', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addStopToCollectionIfMissing', () => {
      it('should add a Stop to an empty array', () => {
        const stop: IStop = sampleWithRequiredData;
        expectedResult = service.addStopToCollectionIfMissing([], stop);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(stop);
      });

      it('should not add a Stop to an array that contains it', () => {
        const stop: IStop = sampleWithRequiredData;
        const stopCollection: IStop[] = [
          {
            ...stop,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addStopToCollectionIfMissing(stopCollection, stop);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Stop to an array that doesn't contain it", () => {
        const stop: IStop = sampleWithRequiredData;
        const stopCollection: IStop[] = [sampleWithPartialData];
        expectedResult = service.addStopToCollectionIfMissing(stopCollection, stop);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(stop);
      });

      it('should add only unique Stop to an array', () => {
        const stopArray: IStop[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const stopCollection: IStop[] = [sampleWithRequiredData];
        expectedResult = service.addStopToCollectionIfMissing(stopCollection, ...stopArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const stop: IStop = sampleWithRequiredData;
        const stop2: IStop = sampleWithPartialData;
        expectedResult = service.addStopToCollectionIfMissing([], stop, stop2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(stop);
        expect(expectedResult).toContain(stop2);
      });

      it('should accept null and undefined values', () => {
        const stop: IStop = sampleWithRequiredData;
        expectedResult = service.addStopToCollectionIfMissing([], null, stop, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(stop);
      });

      it('should return initial array if no Stop is added', () => {
        const stopCollection: IStop[] = [sampleWithRequiredData];
        expectedResult = service.addStopToCollectionIfMissing(stopCollection, undefined, null);
        expect(expectedResult).toEqual(stopCollection);
      });
    });

    describe('compareStop', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareStop(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareStop(entity1, entity2);
        const compareResult2 = service.compareStop(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareStop(entity1, entity2);
        const compareResult2 = service.compareStop(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareStop(entity1, entity2);
        const compareResult2 = service.compareStop(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
